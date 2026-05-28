import re
import PyPDF2
from typing import Dict, List, Any
from io import BytesIO

def extract_text_from_pdf(file_content: bytes) -> str:
    """
    Extracts raw text from a PDF file content.
    """
    try:
        pdf_reader = PyPDF2.PdfReader(BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error extracting text: {e}")
        return ""

def parse_resume(text: str) -> Dict[str, Any]:
    """
    Parses resume text to extract structured data using regex and heuristics.
    Maps extracted details to the canonical frontend ResumeData schema.
    """
    lines = [line.strip() for line in text.split('\n')]
    
    # 1. Extract Name
    name = "Unknown"
    for line in lines[:8]:
        if not line:
            continue
        if "@" in line or "http" in line or "github" in line or "linkedin" in line:
            continue
        # Skip lines that look like phone numbers
        if re.search(r"\d{3,}", line):
            continue
        # Skip section headers
        if line.upper() in ["EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS", "SUMMARY", "CONTACT", "CERTIFICATIONS"]:
            continue
        name = line
        break

    # 2. Extract Contact Info
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    email = email_match.group(0) if email_match else ""

    phone_match = re.search(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text)
    phone = phone_match.group(0) if phone_match else ""

    # 3. Extract Links
    linkedin = ""
    github = ""
    website = ""
    for line in lines[:15]:
        line_lower = line.lower()
        if "linkedin.com" in line_lower:
            m = re.search(r"linkedin\.com/in/[\w-]+", line_lower)
            linkedin = "https://" + m.group(0) if m else line
        elif "github.com" in line_lower:
            m = re.search(r"github\.com/[\w-]+", line_lower)
            github = "https://" + m.group(0) if m else line
        elif "portfolio" in line_lower or "personal" in line_lower or "http" in line_lower:
            m = re.search(r"https?://[\w\.-]+\.\w+", line_lower)
            if m: website = m.group(0)

    # 4. Job Title (Heuristic Lookup)
    job_title = ""
    common_titles = [
        "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Engineer",
        "Data Analyst", "Data Scientist", "Product Manager", "Project Manager", "BI Analyst",
        "DevOps Engineer", "Systems Architect", "QA Engineer", "Mobile Developer", "Web Developer"
    ]
    for title in common_titles:
        if re.search(r"\b" + re.escape(title) + r"\b", text, re.IGNORECASE):
            job_title = title
            break
    if not job_title:
        for line in lines[1:5]:
            if line and len(line) < 40 and not any(x in line.lower() for x in ["@", "http", "phone", "location", "+"]):
                job_title = line
                break

    # 5. Location
    location = ""
    loc_match = re.search(r"\b([A-Z][a-zA-Z\s]+),\s*([A-Z]{2}|[A-Z][a-zA-Z]+)\b", text)
    if loc_match:
        location = loc_match.group(0)

    # 6. Skills Matching
    known_skills = [
        "Python", "Java", "JavaScript", "TypeScript", "React", "Node.js", "SQL", "HTML", "CSS", 
        "Docker", "Kubernetes", "AWS", "Azure", "Git", "Machine Learning", "Data Analysis",
        "C++", "C#", "Go", "Rust", "Swift", "Kotlin", "Flutter", "FastAPI", "Django", "Flask",
        "Pandas", "NumPy", "Tableau", "Power BI", "Excel", "Agile", "Project Management", 
        "Leadership", "PostgreSQL", "MongoDB", "Express", "Figma", "Redux", "GraphQL"
    ]
    found_skills = []
    text_lower = text.lower()
    for skill in known_skills:
        if re.search(r"\b" + re.escape(skill.lower()) + r"\b", text_lower):
            found_skills.append(skill)

    # 7. Section Splitting
    sections = {}
    current_section = None
    section_headers = {
        "SUMMARY": ["SUMMARY", "PROFESSIONAL SUMMARY", "PROFILE", "CAREER OBJECTIVE", "OBJECTIVE"],
        "EXPERIENCE": ["EXPERIENCE", "WORK EXPERIENCE", "WORK HISTORY", "EMPLOYMENT HISTORY", "PROFESSIONAL EXPERIENCE"],
        "EDUCATION": ["EDUCATION", "ACADEMIC BACKGROUND", "ACADEMICS", "ACADEMIC HISTORY"],
        "PROJECTS": ["PROJECTS", "PERSONAL PROJECTS", "ACADEMIC PROJECTS", "KEY PROJECTS"],
        "CERTIFICATIONS": ["CERTIFICATIONS", "CERTIFICATES", "LICENSES"]
    }
    
    for line in lines:
        if not line:
            continue
        upper_line = line.upper().strip()
        upper_line = re.sub(r"^[#\-\*\s]+", "", upper_line)
        found_transition = False
        for sec_name, keywords in section_headers.items():
            if upper_line in keywords or any(upper_line.startswith(k + " ") for k in keywords) or any(upper_line.endswith(" " + k) for k in keywords):
                current_section = sec_name
                sections[current_section] = []
                found_transition = True
                break
        if found_transition:
            continue
            
        if current_section:
            sections[current_section].append(line)

    def clean_bullets(text_lines):
        return "\n".join([re.sub(r"^[\-\*\•\d\.\s]+", "", l).strip() for l in text_lines if l.strip()])

    # Summary
    summary = ""
    if "SUMMARY" in sections:
        summary = "\n".join(sections["SUMMARY"])
    else:
        fallback_lines = []
        for line in lines[2:10]:
            if any(h in line.upper() for h in ["EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS"]):
                break
            if len(line) > 30:
                fallback_lines.append(line)
        summary = " ".join(fallback_lines)

    # Experience
    experience = []
    if "EXPERIENCE" in sections:
        job_blocks = []
        current_block = []
        for line in sections["EXPERIENCE"]:
            if re.search(r"\b(Present|20\d{2})\b", line) and len(line) < 80:
                if current_block:
                    job_blocks.append(current_block)
                    current_block = []
            current_block.append(line)
        if current_block:
            job_blocks.append(current_block)

        for idx, block in enumerate(job_blocks):
            title = ""
            company = ""
            start_date = ""
            end_date = ""
            current = False
            desc_lines = []
            
            header_line = block[0] if block else ""
            dates = re.findall(r"\b(Present|20\d{2})\b", header_line)
            if len(dates) >= 2:
                start_date = dates[0]
                end_date = dates[1]
                if end_date.lower() == "present":
                    current = True
            elif len(dates) == 1:
                start_date = dates[0]
                if "present" in header_line.lower():
                    end_date = ""
                    current = True
                else:
                    end_date = dates[0]
            
            header_clean = re.sub(r"\b(Present|20\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b", "", header_line, flags=re.IGNORECASE)
            header_clean = re.sub(r"[\-–—,\s|]+$", "", header_clean).strip()
            
            parts = re.split(r"\s+at\s+|\s*[-|]\s*|\s*,\s*", header_clean)
            if len(parts) >= 2:
                title = parts[0].strip()
                company = parts[1].strip()
            else:
                title = header_clean
                company = "Technology Solutions"

            for line in block[1:]:
                if line.strip():
                    desc_lines.append(line)
            
            experience.append({
                "id": f"exp-{idx + 1}",
                "title": title or "Software Engineer",
                "company": company or "Technology Solutions",
                "location": "Remote",
                "startDate": start_date or "2023-01",
                "endDate": end_date if not current else "",
                "current": current,
                "description": clean_bullets(desc_lines)
            })
    
    # Education
    education = []
    if "EDUCATION" in sections:
        edu_blocks = []
        current_block = []
        for line in sections["EDUCATION"]:
            if any(k in line.lower() for k in ["university", "college", "school", "institute"]) and len(line) < 80:
                if current_block:
                    edu_blocks.append(current_block)
                    current_block = []
            current_block.append(line)
        if current_block:
            edu_blocks.append(current_block)
            
        for idx, block in enumerate(edu_blocks):
            school = ""
            degree = ""
            field = ""
            start_date = ""
            end_date = ""
            desc_lines = []
            
            header_line = block[0] if block else ""
            school = header_line
            
            for line in block[1:]:
                line_lower = line.lower()
                if "degree" in line_lower or "bachelor" in line_lower or "master" in line_lower or "bs" in line_lower or "b.tech" in line_lower or "m.tech" in line_lower:
                    degree = line
                elif "science" in line_lower or "engineering" in line_lower or "computer" in line_lower or "it" in line_lower:
                    field = line
                elif re.search(r"\b(20\d{2})\b", line):
                    dates = re.findall(r"\b(20\d{2})\b", line)
                    if len(dates) >= 2:
                        start_date = dates[0]
                        end_date = dates[1]
                    elif len(dates) == 1:
                        start_date = dates[0]
                        end_date = dates[0]
                else:
                    desc_lines.append(line)
            
            education.append({
                "id": f"edu-{idx + 1}",
                "school": school or "State University",
                "degree": degree or "Bachelor of Science",
                "fieldOfStudy": field or "Computer Science",
                "startDate": start_date or "2019",
                "endDate": end_date or "2023",
                "current": False,
                "description": " ".join(desc_lines)
            })

    # Projects
    projects = []
    if "PROJECTS" in sections:
        proj_blocks = []
        current_block = []
        for line in sections["PROJECTS"]:
            if line.strip() and not line.strip().startswith("-") and len(line) < 50:
                if current_block:
                    proj_blocks.append(current_block)
                    current_block = []
            current_block.append(line)
        if current_block:
            proj_blocks.append(current_block)
            
        for idx, block in enumerate(proj_blocks):
            name = block[0] if block else "Side Project"
            desc_lines = []
            link = ""
            
            for line in block[1:]:
                if "github.com" in line.lower() or "http" in line.lower():
                    m = re.search(r"https?://[\w\.-]+\.\w+", line)
                    if m: link = m.group(0)
                else:
                    desc_lines.append(line)
                    
            projects.append({
                "id": f"proj-{idx + 1}",
                "name": name,
                "role": "Creator / Developer",
                "startDate": "2023-01",
                "endDate": "2023-06",
                "current": False,
                "description": clean_bullets(desc_lines),
                "link": link
            })

    # Fallback to keep schema fully populated
    return {
        "personalInfo": {
            "fullName": name if name != "Unknown" else "",
            "email": email,
            "phone": phone,
            "location": location,
            "jobTitle": job_title,
            "website": website,
            "linkedin": linkedin,
            "github": github
        },
        "summary": summary,
        "experience": experience,
        "education": education,
        "skills": found_skills,
        "projects": projects,
        "certifications": [],
        "achievements": [],
        "languages": []
    }

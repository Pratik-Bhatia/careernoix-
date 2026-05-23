'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export function ResumePreview() {
    const { resumeData } = useResumeStore();
    const { personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages } = resumeData;

    const hasAnyContent = 
        personalInfo.fullName || 
        summary || 
        experience.length > 0 || 
        education.length > 0 || 
        skills.length > 0 || 
        projects.length > 0 || 
        certifications.length > 0 || 
        achievements.length > 0 || 
        languages.length > 0;

    if (!hasAnyContent) {
        return (
            <div className="bg-surface rounded-2xl border border-border p-8 text-center text-text-placeholder min-h-[500px] flex items-center justify-center">
                Your resume preview will appear here as you add details.
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 sm:p-8 space-y-6 text-xs max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin text-text-primary">
            {/* Header / Personal Info */}
            <div className="text-center space-y-2 border-b border-gray-100 pb-4">
                <h1 className="text-xl font-bold tracking-tight">{personalInfo.fullName || 'Your Name'}</h1>
                {personalInfo.jobTitle && (
                    <p className="text-sm font-semibold text-primary">{personalInfo.jobTitle}</p>
                )}
                
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-text-secondary mt-2">
                    {personalInfo.email && (
                        <span className="inline-flex items-center gap-1">
                            <Mail size={12} className="text-text-placeholder" />
                            {personalInfo.email}
                        </span>
                    )}
                    {personalInfo.phone && (
                        <span className="inline-flex items-center gap-1">
                            <Phone size={12} className="text-text-placeholder" />
                            {personalInfo.phone}
                        </span>
                    )}
                    {personalInfo.location && (
                        <span className="inline-flex items-center gap-1">
                            <MapPin size={12} className="text-text-placeholder" />
                            {personalInfo.location}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-text-secondary mt-1">
                    {personalInfo.website && (
                        <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                            <Globe size={12} />
                            Portfolio
                        </a>
                    )}
                    {personalInfo.linkedin && (
                        <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                            <Linkedin size={12} />
                            LinkedIn
                        </a>
                    )}
                    {personalInfo.github && (
                        <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                            <Github size={12} />
                            GitHub
                        </a>
                    )}
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="space-y-1.5">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-primary border-b border-primary/10 pb-0.5">Professional Summary</h2>
                    <p className="leading-relaxed text-text-secondary whitespace-pre-wrap">{summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-primary border-b border-primary/10 pb-0.5">Work Experience</h2>
                    <div className="space-y-3">
                        {experience.map((exp) => (
                            <div key={exp.id} className="space-y-1">
                                <div className="flex justify-between items-start font-bold">
                                    <span>{exp.title} <span className="font-normal text-text-secondary">at</span> {exp.company}</span>
                                    <span className="font-normal text-text-secondary text-[10px]">
                                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                {exp.location && (
                                    <p className="text-[10px] text-text-placeholder">{exp.location}</p>
                                )}
                                {exp.description && (
                                    <ul className="list-disc pl-4 space-y-1 text-text-secondary mt-1">
                                        {exp.description.split('\n').filter(Boolean).map((bullet, idx) => (
                                            <li key={idx} className="leading-relaxed">
                                                {bullet.replace(/^[-•]\s*/, '').trim()}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-primary border-b border-primary/10 pb-0.5">Education</h2>
                    <div className="space-y-2">
                        {education.map((edu) => (
                            <div key={edu.id} className="space-y-0.5">
                                <div className="flex justify-between items-start font-bold">
                                    <span>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</span>
                                    <span className="font-normal text-text-secondary text-[10px]">
                                        {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                                    </span>
                                </div>
                                <p className="text-text-secondary">{edu.school}</p>
                                {edu.description && (
                                    <p className="text-text-placeholder leading-relaxed mt-0.5">{edu.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-primary border-b border-primary/10 pb-0.5">Skills</h2>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {skills.map((skill, idx) => (
                            <span key={idx} className="bg-gray-100 text-text-secondary px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-primary border-b border-primary/10 pb-0.5">Projects</h2>
                    <div className="space-y-3">
                        {projects.map((proj) => (
                            <div key={proj.id} className="space-y-1">
                                <div className="flex justify-between items-start font-bold">
                                    <span>
                                        {proj.name} 
                                        {proj.role && <span className="font-normal text-text-secondary"> ({proj.role})</span>}
                                    </span>
                                    <span className="font-normal text-text-secondary text-[10px]">
                                        {proj.startDate} - {proj.current ? 'Present' : proj.endDate}
                                    </span>
                                </div>
                                {proj.link && (
                                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block text-[10px] truncate max-w-xs">
                                        {proj.link}
                                    </a>
                                )}
                                {proj.description && (
                                    <ul className="list-disc pl-4 space-y-1 text-text-secondary mt-1">
                                        {proj.description.split('\n').filter(Boolean).map((bullet, idx) => (
                                            <li key={idx} className="leading-relaxed">
                                                {bullet.replace(/^[-•]\s*/, '').trim()}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-primary border-b border-primary/10 pb-0.5">Certifications</h2>
                    <div className="space-y-1.5">
                        {certifications.map((cert) => (
                            <div key={cert.id} className="flex justify-between items-start">
                                <div>
                                    <span className="font-bold">{cert.name}</span>
                                    <span className="text-text-placeholder"> - {cert.issuer}</span>
                                    {cert.link && (
                                        <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2 text-[10px]">
                                            View
                                        </a>
                                    )}
                                </div>
                                <span className="text-text-secondary text-[10px]">{cert.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-primary border-b border-primary/10 pb-0.5">Achievements</h2>
                    <ul className="list-disc pl-4 space-y-1 text-text-secondary">
                        {achievements.map((ach, idx) => (
                            <li key={idx} className="leading-relaxed">
                                {ach}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-primary border-b border-primary/10 pb-0.5">Languages</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {languages.map((lang) => (
                            <div key={lang.id} className="inline-flex gap-1">
                                <span className="font-bold">{lang.name}</span>
                                <span className="text-text-secondary">({lang.proficiency})</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

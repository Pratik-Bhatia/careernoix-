'use client';

import { useResumeStore, ResumeData } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumePreviewProps {
    dataOverride?: ResumeData;
    highlightMode?: boolean;
}

export function ResumePreview({ dataOverride, highlightMode = false }: ResumePreviewProps = {}) {
    const storeResumeData = useResumeStore(s => s.resumeData);
    const resumeData = dataOverride || storeResumeData;
    
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
        <div className="space-y-6 text-[13px] text-gray-900 leading-[1.6] font-sans font-medium tracking-tight">
            {/* Header / Personal Info */}
            <div className="text-center space-y-1.5 border-b-2 border-gray-900 pb-5 mb-5">
                <h1 className="text-3xl font-black tracking-tighter uppercase">{personalInfo.fullName || 'Your Name'}</h1>
                {personalInfo.jobTitle && (
                    <p className="text-[14px] font-bold text-gray-700 tracking-wide">{personalInfo.jobTitle}</p>
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
                <div className="space-y-2">
                    <h2 className="text-[14px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1">Professional Summary</h2>
                    <p className="leading-[1.6] text-gray-700 whitespace-pre-wrap">{summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-[14px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1">Work Experience</h2>
                    <div className="space-y-4">
                        {experience.map((exp) => (
                            <div key={exp.id} className="space-y-1.5">
                                <div className="flex justify-between items-baseline font-bold">
                                    <span className="text-[14px]">{exp.title} <span className="font-semibold text-gray-600">at</span> {exp.company}</span>
                                    <span className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider">
                                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                {exp.location && (
                                    <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">{exp.location}</p>
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
                    <h2 className="text-[14px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1">Education</h2>
                    <div className="space-y-4">
                        {education.map((edu) => (
                            <div key={edu.id} className="space-y-1">
                                <div className="flex justify-between items-baseline font-bold">
                                    <span className="text-[14px]">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</span>
                                    <span className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider">
                                        {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                                    </span>
                                </div>
                                <p className="font-semibold text-gray-700">{edu.school}</p>
                                {edu.description && (
                                    <p className="text-gray-600 leading-[1.6] mt-1">{edu.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-[14px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1">Skills</h2>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {skills.map((skill, idx) => (
                            <span key={idx} className="text-gray-800 tracking-tight font-semibold">
                                {skill}{idx < skills.length - 1 ? ' • ' : ''}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-[14px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1">Projects</h2>
                    <div className="space-y-4">
                        {projects.map((proj) => (
                            <div key={proj.id} className="space-y-1">
                                <div className="flex justify-between items-baseline font-bold">
                                    <span className="text-[14px]">
                                        {proj.name} 
                                        {proj.role && <span className="font-semibold text-gray-600"> ({proj.role})</span>}
                                    </span>
                                    <span className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider">
                                        {proj.startDate} - {proj.current ? 'Present' : proj.endDate}
                                    </span>
                                </div>
                                {proj.link && (
                                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 font-medium block text-[12px] truncate max-w-xs transition-colors">
                                        {proj.link}
                                    </a>
                                )}
                                {proj.description && (
                                    <ul className="list-disc pl-4 space-y-1 text-gray-700 mt-1.5">
                                        {proj.description.split('\n').filter(Boolean).map((bullet, idx) => (
                                            <li key={idx} className="leading-[1.6]">
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
                <div className="space-y-3">
                    <h2 className="text-[14px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1">Certifications</h2>
                    <div className="space-y-2">
                        {certifications.map((cert) => (
                            <div key={cert.id} className="flex justify-between items-baseline">
                                <div className="text-[14px]">
                                    <span className="font-bold text-gray-900">{cert.name}</span>
                                    <span className="font-semibold text-gray-600"> - {cert.issuer}</span>
                                    {cert.link && (
                                        <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 font-medium ml-2 text-[12px] transition-colors">
                                            [View]
                                        </a>
                                    )}
                                </div>
                                <span className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider">{cert.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-[14px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1">Achievements</h2>
                    <ul className="list-disc pl-4 space-y-1.5 text-gray-700">
                        {achievements.map((ach, idx) => (
                            <li key={idx} className="leading-[1.6]">
                                {ach}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-[14px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1">Languages</h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {languages.map((lang) => (
                            <div key={lang.id} className="inline-flex items-baseline gap-1.5 text-[14px]">
                                <span className="font-bold text-gray-900">{lang.name}</span>
                                <span className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider">({lang.proficiency})</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

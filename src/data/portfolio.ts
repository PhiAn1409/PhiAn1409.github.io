import type { PersonalInfo, Experience, Education, Project, Skill, Certificate } from '../types';

export const personalInfo: PersonalInfo = {
  name: 'Trương Phi Ân',
  title: 'Sinh viên Công nghệ Phần mềm',
  email: 'phian.14092004@gmail.com',
  phone: '0763000952',
  location: 'TP. Hồ Chí Minh, Việt Nam',
  github: 'https://github.com/truongphian',
  linkedin: 'https://linkedin.com/in/truongphian',
  summary: 'Sinh viên năm cuối chuyên ngành Công nghệ Phần mềm tại Đại học Công nghệ TP.HCM (Hutech). Đam mê phát triển web và học hỏi các công nghệ mới. Có kiến thức về JavaScript, TypeScript, React và các công nghệ web hiện đại.'
};

export const experiences: Experience[] = [
  {
    title: 'Thực tập Front-end Developer',
    company: 'Dự án cá nhân',
    period: '2024 - Hiện tại',
    description: [
      'Phát triển website portfolio cá nhân với Astro và Tailwind CSS',
      'Xây dựng giao diện responsive và tối ưu trải nghiệm người dùng',
      'Tích hợp blog với Markdown và MDX',
      'Áp dụng các best practices trong phát triển web',
      'Sử dụng Git/GitHub để quản lý source code'
    ]
  },
  {
    title: 'Dự án học tập',
    company: 'Đại học Hutech',
    period: '2022 - 2024',
    description: [
      'Tham gia các dự án nhóm phát triển ứng dụng web',
      'Học và thực hành HTML5, CSS3, JavaScript',
      'Làm việc với React và các thư viện JavaScript hiện đại',
      'Tìm hiểu về cơ sở dữ liệu và backend development',
      'Áp dụng Agile trong quản lý dự án nhóm'
    ]
  }
];

export const education: Education[] = [
  {
    degree: 'Cử nhân Công nghệ Phần mềm',
    institution: 'Đại học Công nghệ TP.HCM (Hutech)',
    period: '2021 - 2025',
    gpa: 'Năm cuối'
  },
  {
    degree: 'Các khóa học trực tuyến',
    institution: 'Udemy, Coursera, FreeCodeCamp',
    period: '2022 - Hiện tại'
  }
];

export const projects: Project[] = [
  {
    title: 'Website Portfolio & Blog',
    description: 'Website giới thiệu bản thân và blog cá nhân được xây dựng với Astro framework',
    technologies: ['Astro', 'TypeScript', 'Tailwind CSS', 'MDX']
  },
  {
    title: 'Ứng dụng Quản lý Task',
    description: 'Ứng dụng quản lý công việc đơn giản với giao diện thân thiện',
    technologies: ['React', 'Firebase', 'Material-UI']
  },
  {
    title: 'Website Tra cứu Thời tiết',
    description: 'Ứng dụng tra cứu thời tiết với giao diện hiện đại và responsive',
    technologies: ['JavaScript', 'OpenWeather API', 'CSS3']
  },
  {
    title: 'Trang Landing Page',
    description: 'Các trang landing page responsive cho thực hành front-end',
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  }
];

export const skills: Skill[] = [
  {
    category: 'Frontend',
    items: ['HTML5', 'CSS3', 'JavaScript ES6+', 'TypeScript', 'React', 'Astro', 'Tailwind CSS', 'Responsive Design']
  },
  {
    category: 'Backend & Database',
    items: ['Node.js', 'Express.js', 'Firebase', 'MySQL', 'MongoDB', 'REST API']
  },
  {
    category: 'Công cụ & Khác',
    items: ['Git/GitHub', 'VS Code', 'Figma', 'Postman', 'npm/yarn']
  },
  {
    category: 'Kỹ năng mềm',
    items: ['Làm việc nhóm', 'Tự học', 'Giải quyết vấn đề', 'Quản lý thời gian']
  }
];

export const certificates: Certificate[] = [
  { 
    name: 'Networking Basics', 
    issuer: 'Cisco Networking Academy', 
    year: '2024',
    image: '/certificates/networking-basics.jpg'
  },
  { 
    name: 'JavaScript Essentials 1', 
    issuer: 'Cisco Networking Academy', 
    year: '2024',
    image: '/certificates/javascript-essentials-1.jpg'
  },
  { 
    name: 'JavaScript Essentials 2', 
    issuer: 'Cisco Networking Academy', 
    year: '2024',
    image: '/certificates/javascript-essentials-2.jpg'
  }
];

import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@q10courses.com' },
    update: {},
    create: {
      name: 'Admin Principal',
      email: 'admin@q10courses.com',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  const courses = [
    {
      title: 'Marketing Digital Completo',
      slug: 'marketing-digital-completo',
      description: 'Aprende las estrategias más efectivas de marketing digital para impulsar tu negocio.',
      shortDesc: 'Domina el marketing digital desde cero',
      price: 49.99,
      category: 'Marketing',
      instructor: 'Carlos Méndez',
      whatYouLearn: 'SEO, SEM, Redes Sociales, Email Marketing, Analytics',
      q10Link: 'https://q10.com/curso/marketing-digital',
    },
    {
      title: 'Desarrollo Web con React',
      slug: 'desarrollo-web-react',
      description: 'Conviértete en desarrollador frontend con React, TypeScript y las mejores prácticas.',
      shortDesc: 'Construye aplicaciones web modernas',
      price: 59.99,
      category: 'Programación',
      instructor: 'Ana López',
      whatYouLearn: 'React, TypeScript, Hooks, Next.js, TailwindCSS',
      q10Link: 'https://q10.com/curso/react-web',
    },
    {
      title: 'Inteligencia Artificial Aplicada',
      slug: 'inteligencia-artificial-aplicada',
      description: 'Descubre cómo aplicar IA y Machine Learning en proyectos reales.',
      shortDesc: 'IA práctica para profesionales',
      price: 79.99,
      category: 'Tecnología',
      instructor: 'Dr. Roberto Vargas',
      whatYouLearn: 'Machine Learning, Deep Learning, NLP, Computer Vision',
      q10Link: 'https://q10.com/curso/ia-aplicada',
    },
    {
      title: 'Finanzas Personales para Emprendedores',
      slug: 'finanzas-personales-emprendedores',
      description: 'Aprende a gestionar tus finanzas y hacer crecer tu dinero.',
      shortDesc: 'Controla tus finanzas y multiplica tu dinero',
      price: 39.99,
      category: 'Finanzas',
      instructor: 'María Fernanda Ruiz',
      whatYouLearn: 'Presupuestos, Inversiones, Ahorro, Impuestos',
      q10Link: 'https://q10.com/curso/finanzas-emprendedores',
    },
    {
      title: 'Diseño UX/UI Profesional',
      slug: 'diseno-ux-ui-profesional',
      description: 'Aprende diseño de experiencia de usuario e interfaces desde cero.',
      shortDesc: 'Crea experiencias digitales memorables',
      price: 54.99,
      category: 'Diseño',
      instructor: 'Laura Castillo',
      whatYouLearn: 'Figma, Prototipado, Investigación UX, Design Systems',
      q10Link: 'https://q10.com/curso/ux-ui',
    },
    {
      title: 'Python para Ciencia de Datos',
      slug: 'python-ciencia-datos',
      description: 'El lenguaje Python aplicado al análisis de datos y visualización.',
      shortDesc: 'Analiza datos como un profesional',
      price: 69.99,
      category: 'Programación',
      instructor: 'Andrés Martínez',
      whatYouLearn: 'Python, Pandas, NumPy, Matplotlib, Jupyter',
      q10Link: 'https://q10.com/curso/python-datos',
    },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: course,
    });
  }

  console.log('Seed completed successfully');
  console.log(`Admin created: admin@q10courses.com / Admin123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

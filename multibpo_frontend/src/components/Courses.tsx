import CourseCard from "./CourseCard";
import { spacing, backgrounds, typography } from "@/lib/design-system";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Courses = () => {
  const { ref, isVisible } = useScrollReveal();

  const courses = [
    {
      image:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop",
      tag: "16 semanas",
      subtitle: "Tecnologia Contábil",
      title: "Automação Contábil com IA",
      linkText: "Ver Curso",
    },
    {
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop",
      tag: "12 semanas",
      subtitle: "Marketing Digital",
      title: "Marketing para Escritórios Contábeis",
      linkText: "Ver Curso",
    },
    {
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop",
      tag: "8 semanas",
      subtitle: "Gestão Empresarial",
      title: "Transformação Digital em Contabilidade",
      linkText: "Ver Curso",
    },
  ];

  return (
    <section
      ref={ref}
      className={`${backgrounds.secondary} ${spacing.section.md} xl:pb-44 xl:pt-40`}
      id="courses"
    >
      <div className={`${spacing.container} w-full`}>
        <div
          className={`${spacing.content.md} transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2
            className={`${typography.heading.lg} text-gray-900 mb-4 text-left`}
          >
            Nossos <span className="text-blue-600">Cursos</span>
          </h2>

          <p
            className={`${typography.body.lg} text-gray-600 text-left max-w-2xl`}
          >
            Desenvolva suas habilidades com nossos cursos especializados em
            tecnologia e gestão contábil. Aprenda com especialistas e transforme
            sua carreira.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                index === 0
                  ? "delay-200"
                  : index === 1
                  ? "delay-500"
                  : "delay-700"
              } ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
            >
              <CourseCard
                image={course.image}
                tag={course.tag}
                subtitle={course.subtitle}
                title={course.title}
                linkText={course.linkText}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;

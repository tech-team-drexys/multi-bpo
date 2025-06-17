// src/components/Services.tsx (versão integrada)
import { CategorizedGallery } from "@/components/ui/gallery4";
import { backgrounds } from "@/lib/design-system";
import { useServices, useCategories } from "@/hooks/useServices";
import { Gallery4Item } from "@/components/ui/gallery4";

const Services = () => {
 const { data: services, isLoading: servicesLoading } = useServices();
 const { data: categories, isLoading: categoriesLoading } = useCategories();

 // Transformar dados do Django para o formato do componente
 const transformedServices: Gallery4Item[] = services?.map((service: any) => ({
   id: service.slug,
   title: service.titulo,
   description: service.descricao_curta,
   href: `/servicos/${service.slug}`,
   image: service.imagem_principal || '/services-pictures/default.png',
 })) || [];

 // Se não há dados da API, usar dados padrão do gallery4
 const hasApiData = transformedServices.length > 0;

 if (servicesLoading || categoriesLoading) {
   return (
     <section id="services" className={backgrounds.primary}>
       <div className="container mx-auto py-20">
         <div className="text-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
           <p className="mt-4 text-gray-600">Carregando serviços...</p>
         </div>
       </div>
     </section>
   );
 }

 return (
   <section id="services" className={backgrounds.primary}>
     <CategorizedGallery
       title="Nossos Serviços"
       description="Uma plataforma completa de BPO desenvolvida especificamente para revolucionar a gestão de escritórios contábeis modernos."
       items={hasApiData ? transformedServices : undefined}
     />
   </section>
 );
};

export default Services;
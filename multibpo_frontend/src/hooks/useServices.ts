// src/hooks/useServices.ts
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => apiService.getServices(),
    enabled: false, // <- ADICIONAR ESTA LINHA
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => apiService.getService(id),
    enabled: !!id, // <- MANTER ESTA (já existe)
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiService.getCategories(),
    enabled: false, // <- ADICIONAR ESTA LINHA
    staleTime: 10 * 60 * 1000, // 10 minutos (categorias mudam menos)
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useServicesByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['services', 'category', categoryId],
    queryFn: () => apiService.getServicesByCategory(categoryId),
    enabled: !!categoryId, // <- MANTER ESTA (já existe)
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
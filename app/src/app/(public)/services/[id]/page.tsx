import { notFound } from 'next/navigation';
import { fn_get_service_by_id, type ServiceId } from '@/actions/fn-services';
import { ServiceDetailClient } from './_components/service-detail-client';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const serviceId = id as ServiceId;

  const service = await fn_get_service_by_id(serviceId);
  if (!service) notFound();

  return <ServiceDetailClient service={service} />;
}

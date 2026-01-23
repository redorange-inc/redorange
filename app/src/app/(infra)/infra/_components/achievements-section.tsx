'use client';

import { Clock, Award, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AchievementsData } from './types';

interface AchievementsSectionProps {
  achievements: AchievementsData;
}

const iconMap: Record<string, React.ElementType> = {
  clock: Clock,
  award: Award,
  thumbsUp: ThumbsUp,
};

export const AchievementsSection = ({ achievements }: AchievementsSectionProps) => {
  return (
    <div className="space-y-6" data-anim="fade-up">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">{achievements.title}</h2>
        <Badge variant="outline" className="border-infra/30 text-muted-foreground">
          KPIs
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {achievements.items.map((achievement, index) => {
          const IconComponent = iconMap[achievement.iconName] || Clock;

          return (
            <Card key={index} className="border-infra/20 transition-all hover:border-infra/40 hover:shadow-md">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-infra/10">
                    <IconComponent className="h-5 w-5 text-infra" />
                  </div>
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">{achievement.subtitle}</p>
                  </div>
                </div>
                <Badge className="bg-infra/10 text-infra border-0 font-heading text-lg px-3 py-1">{achievement.value}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

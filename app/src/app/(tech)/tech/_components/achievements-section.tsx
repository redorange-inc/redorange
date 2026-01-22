'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ui, getIcon } from './constants';
import type { AchievementResponse } from './types';

interface AchievementsSectionProps {
  achievements: AchievementResponse['items'];
}

export const AchievementsSection = ({ achievements }: AchievementsSectionProps) => {
  return (
    <section data-anim="fade-up">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">Logros destacados</h3>
        <Badge className="rounded-full bg-background/60 text-foreground backdrop-blur">KPIs</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {achievements.map((achievement, idx) => (
          <Card key={idx} className={`rounded-3xl ${ui.glassCard} ${ui.hoverLift}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-tech p-3 text-tech">{getIcon(achievement.iconName, 'sm')}</div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground">{achievement.description}</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-foreground px-4 py-2 text-sm font-bold text-background shadow-lg">{achievement.metric}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

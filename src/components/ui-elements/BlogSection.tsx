
import React from 'react';
import { BlogContent } from '@/utils/blogContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BlogSectionProps {
  content: BlogContent;
}

const BlogSection: React.FC<BlogSectionProps> = ({ content }) => {
  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold mb-6">{content.title}</h2>
      <div className="space-y-6">
        {content.sections.map((section, index) => (
          <Card key={index} className="border border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{section.heading}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;

import { Button } from "@cot/ui";
import { Sparkles } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <div className="flex justify-center">
          <Sparkles className="h-16 w-16 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight">
          Cot Demo Application
        </h1>
        
        <p className="text-xl text-muted-foreground">
          This is a live demonstration of an ERP built with Cot. 
          See how developers can create powerful, custom business applications 
          in minutes instead of months.
        </p>
        
        <div className="flex justify-center gap-4">
          <Button size="lg">
            Explore Demo
          </Button>
          <Button size="lg" variant="outline">
            View Source
          </Button>
        </div>
        
        <div className="pt-8 text-sm text-muted-foreground">
          <p>cot.ac - Demo Instance</p>
          <p className="mt-2">
            Built with <span className="font-semibold">Cot</span> • 
            Styled with <span className="font-semibold">@cot/ui</span>
          </p>
        </div>
      </div>
    </div>
  );
}

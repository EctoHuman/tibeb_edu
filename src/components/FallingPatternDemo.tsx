import { FallingPattern } from "@/components/ui/falling-pattern";

export default function FallingPatternDemo() {
	return (
		<div className="w-full relative min-h-screen bg-background">
			<FallingPattern className="h-screen [mask-image:radial-gradient(ellipse_at_center,transparent,var(--background))]" />
			<div className="absolute inset-0 z-10 flex items-center justify-center">
				<h1 className="font-mono text-7xl font-extrabold tracking-tighter text-foreground">
					Falling Pattern
				</h1>
			</div>
		</div>
	);
}

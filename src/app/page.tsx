import { FeedbackForm } from '@/components/feedback-form';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-lg">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Patient Feedback
          </h1>
          <p className="text-muted-foreground mt-2">
            Please take a moment to share your experience with us today.
          </p>
        </header>

        <FeedbackForm />

        <footer className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            Your data is securely stored and handled in accordance with Australian privacy laws.
          </p>
        </footer>
      </div>
    </main>
  );
}

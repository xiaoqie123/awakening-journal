import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto pt-12 pb-16">
      <div className="text-center mb-8">
        <span className="text-4xl block mb-4">🌙</span>
        <h1 className="text-2xl font-heading font-medium text-ink dark:text-[#E8E6E3] mb-2">
          觉醒日志
        </h1>
        <p className="text-sm text-ink-muted dark:text-[#9A9A9E]">
          觉察是改变的开始
        </p>
      </div>
      <LoginForm />
    </div>
  );
}

interface ModernTextHeroProps {
  title: string;
  content: string;
}

const ModernTextHero = ({ title, content }: ModernTextHeroProps) => {
  const parsedTitle = title.replace(/\*(.*?)\*/g, "<b>$1</b>");

  return (
    <section className="relative my-3 h-[100px] w-full overflow-hidden md:h-[130px]">
      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h3
          className="mb-4 text-3xl tracking-tight text-black-base md:text-5xl"
          dangerouslySetInnerHTML={{ __html: parsedTitle }}
        />
        <p className="text-sm text-gray-700 md:text-lg">{content}</p>
      </div>
    </section>
  );
};

export default ModernTextHero;

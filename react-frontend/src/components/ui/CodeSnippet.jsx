const CodeSnippet = () => {
  return (
    <div className="bg-black/30 border border-accent-purple/10 rounded-[10px] py-3 px-5 font-mono text-[0.78rem] w-full text-center animate-code-glow">
      <span className="text-text-secondary">
        <span className="text-accent-pink">const</span> <span className="text-accent-cyan">future</span> = <span className="text-accent-pink">await</span> <span className="text-accent-violet">snap.it</span>();
      </span>
    </div>
  );
};

export default CodeSnippet;

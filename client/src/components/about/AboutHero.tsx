// -----------------------------------------------------------------------------
// AboutHero.tsx — the headshot + intro block at the top of /about.
// Author: Shuai Ju
// -----------------------------------------------------------------------------
import headshotImage from '../../assets/headshot.svg';
import ResumeDownloadButton from '../ResumeDownloadButton';

export default function AboutHero() {
  return (
    // Two columns above md (fixed 280px headshot + fluid text); single column
    // below md, with the headshot cap-widthed so it doesn't fill the screen.
    <div className="grid gap-8 items-start grid-cols-1 md:grid-cols-[280px_1fr]">
      <img
        src={headshotImage}
        alt="Portrait of Shuai Ju"
        width={280}
        height={280}
        className="w-full max-w-[280px] h-auto md:w-[280px] md:h-[280px] object-cover rounded-lg bg-surface-2 border border-border shadow-md"
      />

      <div className="grid gap-3">
        <h2 className="mb-0">Shuai Ju</h2>
        <p className="text-accent font-medium m-0">Student - Web Development</p>

        <p className="m-0 leading-relaxed">
          I'm a software engineering student at Centennial College, with a focus on web
          development in this COMP229 course, section 404. I'm learning to build web
          applications that are both functional and visually appealing. My goal is to
          create user-friendly experiences while writing clean and maintainable code.
        </p>

        <p className="m-0 leading-relaxed">
          I'm also learning Java, Databases, and other programming languages and
          technologies. I enjoy exploring new tools and frameworks to stay up-to-date
          with the latest trends in web development.
        </p>

        {/* `justify-self-start` on the button wrapper keeps it from
            stretching to fill the grid cell. */}
        <div className="justify-self-start mt-2">
          <ResumeDownloadButton />
        </div>
      </div>
    </div>
  );
}

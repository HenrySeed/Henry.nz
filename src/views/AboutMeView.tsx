import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import "./AboutMeView.css";
import MetaTags from "react-meta-tags";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

export function AboutMeView() {
    const resumeData: {
        date: string;
        title: string;
        location: string;
        color: CSSProperties["color"];
        years: { year: string; text: string | JSX.Element }[];
    }[] = [
        {
            date: "2018 - Now",
            title: "Junior Developer - Senior Developer & Team Lead",
            location: "Amy.app, working remotely",
            color: "#ffff48",
            years: [
                {
                    year: "",
                    text: "Worked as a full stack developer, building front end internal and external tools as well as backend algorithms to support our smart math teaching applications.",
                },
            ],
        },
        // {
        //     date: "2018 - 2019",
        //     title: "Junior Full Stack Developer",
        //     location: "Amy.app, working remotely",
        //     color: "#48ffa0",
        //     years: [
        //         {
        //             year: "2019",
        //             text: "Worked on complex Tree Based Algorithms written with OO principles in TS and designed multiple frontends in React and Polymer with user feedback and UX principles in mind",
        //         },

        //         {
        //             year: "2018",
        //             text: "Began by specialising in Front Ends and UX design, then also started focussing on more Back End work and built multiple algorithm heavy projects as well as React internal tools from the ground up",
        //         },
        //     ],
        // },
        {
            date: "2016 - 2017",
            title: "Freelance Web Developer",
            location: "While at University, Christchurch NZ",
            color: "#ff4848",
            years: [
                {
                    year: "2017",
                    text: "Accepted into the second round of University of Canterbury Entré's $80,000 Startup Challenge.",
                },
                {
                    year: "2016",
                    text: "Attended the 2016 Christchurch Startup Weekend. Worked with a local company to build out their initial infrastructure, advising on backend solutions and building their company website. Mainly scructured in HTML and CSS with a Python and Django backend.",
                },
            ],
        },
        {
            date: "2015 - 2017",
            title: "Bachelor of Science, Majoring in Computer Science",
            location: "University of Canterbury, New Zealand",
            color: "#ff48da",
            years: [
                {
                    year: "2017",
                    text: (
                        <span>
                            Papers in: Databases, Project Management, Graphics,
                            OpenGL.
                            <br />
                            Graduated December 2017
                        </span>
                    ),
                },
                {
                    year: "2016",
                    text: (
                        <span>
                            Papers in: C++, C, Embedded Systems, HTML and CSS,
                            and More Algorithms
                            <br /> My personal projects focussed on more
                            hardware based work, including my{" "}
                            <a
                                href="/portfolio/build-your-own-gameboy"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                Raspberry Pi Gameboy
                            </a>
                            <br />
                            Worked as a Residential Assistant, providing
                            pastoral care and leadership for students at Bishop
                            Julius Hall
                        </span>
                    ),
                },
                {
                    year: "2015",
                    text: (
                        <span>
                            Papers in: Python, AST Algorithms, Information
                            Systems, Marketing, and Philosophy. <br />
                            Built multiple personal projects in HTML + CSS,
                            Python and PHP, including an early version of{" "}
                            <a
                                href="https://halfacup.app/"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                Half a Cup
                            </a>
                        </span>
                    ),
                },
            ],
        },
    ];

    const mapString = `\n              . _..::__:  ,-"-"._       |]       ,     _,.__                
      _.___ _ _<_>\`!(._\`.\`-.    /        _._     \`_ ,_/  '  '-._.---.-.__
    .{     " " \`-==,',._\\{  \\  / {) _   / _ ">_,-' \`                 /-/_ 
    \\_.:--.       \`._ )\`^-. "'     / ( [_/(                       __,/-'    
    '"'    \\        "    _\\        -_,--'                  )     /. (|      
           |           ,'         _)_.\\\\._<> {}              _,' /  '      
           \`.         /          [_/_'\` \`"(                <'}  )         
            \\\\    .-. )          /   \`-'"..' \`:._          _)  '         
     \`        \\  (  \`(          /         \`:\\  > \\  ,-^.  /' '          
               \`._,   ""        |           \\\`'   \\|   ?_)  {\\          
                  \`=.---.       \`._._       ,'     "\`  |' ,- '.           
                    |    \`-._        |     /          \`:\`<_|=--._          
                    (        >       .     | ,          \`=.__.\`-'\\          
                     \`.     /        |     |{|              ,-.,\\     .     
                      |   ,'          \\   / \`'            ,"     \\         
                      |  /             |_'                |  __  /             
                      | |                                 '-'  \`-'   \\.      
                      |/                                        "    /         
                      \\.                                            '        
                                                                        
                       ,/           ______._.--._ _..---.---------.           
    __,-----"-..?----_/ )\\    . ,-'"             "                  (__--/ 
                        /__/\\/                                            \n\n`;

    return (
        <span>
            <MetaTags>
                <title>{`Henry Seed - About me`}</title>
            </MetaTags>
            <div className="projWrapper">
                <Link to="/">
                    <Logo className="projectLogo" />
                </Link>
                <h1 className="hello_title">Hi I'm Henry 👋</h1>

                <pre className="asciimap">
                    {mapString}
                    <div className="marker">#</div>
                </pre>

                <h3>I'm a full-stack developer from &nbsp;🥝 New Zealand</h3>
                <p>
                    During the week I'm an algorithm engineer at{" "}
                    <a target="_blank" rel="noreferrer" href="https://amy.app">
                        Amy.app
                    </a>
                    , focussing on our smart maths-tutoring system.
                </p>
                <p>
                    Outside of work, I love making life easier with
                    carefully-designed, JS driven tools. Mostly built in React,
                    these are either for fun, or for my own edification. I'm
                    also a sucker for some good CLI tools. Enjoy! 🎉
                </p>

                <h2
                    style={{
                        marginBottom: "0px",
                        marginTop: "60px",
                        fontSize: "30pt",
                    }}
                >
                    What have I been doing?
                </h2>
                <div>
                    {resumeData.map((job, i) => (
                        <div
                            className="jobContainer"
                            key={i}
                            style={{ border: `4px solid ${job.color}` }}
                        >
                            <h3
                                className="jobDate"
                                style={{ color: job.color }}
                            >
                                {job.date}
                            </h3>
                            <h2 className="jobTitle">{job.title}</h2>
                            <h4 className="jobLocation">{job.location}</h4>
                            <table>
                                <tbody>
                                    {job.years.map((year, i) => (
                                        <tr key={i}>
                                            <td>{year.year}</td>
                                            <td>{year.text}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        </span>
    );
}

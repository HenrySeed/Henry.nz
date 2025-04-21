import { CSSProperties } from "@mui/material";
import Logo from "../components/Logo";
import "./AboutMeView.css";
import { Link } from "react-router";
import { JSX, useEffect } from "react";

export function AboutMeView() {
    const resumeData: {
        date: string;
        title: string;
        location: string;
        color: CSSProperties["color"];
        years: { year: string; text: string | JSX.Element }[];
    }[] = [
            {
                date: "2022 - 2024",
                title: "Senior Developer & Team Lead",
                location: "Amy.app, working remotely",
                color: "#ffff48",
                years: [
                    {
                        year: "",
                        text: <>
                            <p>Led a development team & managed the hiring of full time developers.</p>
                            <p>Established onboarding processes for new developers as well as  structured mentoring and code reviews.</p>
                            <p>Handled multiple large projects from front end design to project planning, team management, backend APIs and testing. Took large amounts of data and built data visualisation tools for internal and external use. All with React, NodeJS and Typescript.</p>
                            <p>Assisted with government grant application meetings and communications. Closely involved in company direction meetings, OKR planning and team structuring.</p>
                        </>,
                    },
                ],
            },
            {
                date: "Late 2017 - 2021",
                title: "Full Stack Developer",
                location: "Amy.app, working remotely",
                color: "#48ffa0",
                years: [
                    {
                        year: "",
                        text: <>
                            <p>Hired out of University. Initially focussed on Front-End React tools and design, quickly moved to Full-Stack after 6 months. Headed up large scale migration projects affecting thousands of users. All written in Typescript with NodeJS & React.</p>
                            <p>Worked with stakeholders to wireframe, design and implement projects and also build the necessary backend algorithms to support it. Built a lot of Typescript Tree-structure algorithms.</p>
                            <p>Helped with hiring of interns as well as mentoring, training and code reviews.</p>
                        </>,
                    },
                ],
            },
            {
                date: "2016 - 2017",
                title: "Freelance Web Developer",
                location: "While at University, Christchurch NZ",
                color: "#ff4848",
                years: [
                    {
                        year: "",
                        text: <>
                                <p> Attended the 2016 Christchurch Startup Weekend.</p>
                                <p>Worked with a local startup, to build out their initial infrastructure. advising on backend solutions and building their company website. Mainly structured in HTML and CSS with a Python and Django backend.</p>
                            </>,
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

    useEffect(() => {document.title = "Henry Seed - About me"}, [])

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
            <div className="projWrapper">
                <Link to="/">
                    <Logo className="projectLogo" />
                </Link>

                <pre className="asciimap">
                    {mapString}
                    <div className="marker">👨</div>
                </pre>

                <h1 className="hello_title">Hi I'm Henry 👋</h1>
                <h3>I'm a full-stack developer from Christchurch, &nbsp;🥝 New Zealand</h3>
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
                                            {year.year &&
                                                <td className="year">{year.year}</td>
                                            }
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

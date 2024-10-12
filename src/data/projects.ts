import { Project } from '@/types/types';

const projects: Project[] = [
  {
    id: 0,
    title: 'EventNest',
    description:
      "A centralized hub for students at the UofT St. George campus to easily discover and engage with extracurricular events. By aggregating real-time event information, the app simplifies the process of finding activities that match students' interests, helping them engage in the campus community.",
    img: '/images/eventnest.png',
    github: 'https://github.com/klichen/eventnest',
  },
  {
    id: 1,
    title: 'whenToGO',
    description:
      'A web application that allows users to save their frequent GO bus/train trips and easily access them to see arrival and departure times. This web app is designed for frequent riders with irregulars schedules that can benefit from quickly checking when their next bus/train arrives.',
    img: '/images/whentogo.png',
    github: 'https://github.com/klichen/whenToGO',
  },
  // {
  //     id: 2,
  //     title: "Insightle",
  //     description: "A platform for small business owners to receive unbiased feedback and for helpful customers to provide such feedback.",
  //     img: "images/insightle.png"
  // },
  // {
  //     id: 3,
  //     title: "VBCourtMaster",
  //     description: "A Javascript library that allows developers to represent player positions of one team in a volleyball court, it also allows them to display animations of player rotations along with other volleyball related functionality.",
  //     img: "images/insightle.png"
  // },
];

export default projects;

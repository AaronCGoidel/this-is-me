import {
  FaArrowRight,
  FaFileAlt,
  FaGithub,
  FaHammer,
  FaLink,
} from "react-icons/fa";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export enum EmbedType {
  File,
  Project,
  Link,
}

export interface Embed {
  type: EmbedType;
  id: string;
}

interface EmbedProps {
  embed: Embed;
}

const EmbedContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <CardContainer className="inter-var">
      <CardBody className="md:w-96 flex p-4 relative items-center w-full">
        {children}
      </CardBody>
    </CardContainer>
  );
};

const FileEmbed = ({ embed }: EmbedProps) => {
  return (
    <EmbedContainer>
      <CardItem translateZ={40} rotateX={-5} rotateY={20}>
        <FaFileAlt className="mr-4" size={24} />
      </CardItem>
      <CardItem translateZ={40} as="p" className="text-lg">
        {embed.id}
      </CardItem>
      <div className="ml-auto">
        <CardItem translateZ={100}>
          <Button>
            Open <FaArrowRight className="ml-2" />
          </Button>
        </CardItem>
      </div>
    </EmbedContainer>
  );
};

const LinkEmbed = ({ embed }: EmbedProps) => {
  return (
    <EmbedContainer>
      <CardItem rotateZ={-10} translateZ={40}>
        <FaLink className="mr-4" size={18} />
      </CardItem>
      <CardItem translateZ={40} as="p" className="text-lg">
        {embed.id}
      </CardItem>
      <div className="ml-auto">
        <CardItem translateZ={100}>
          <Button>
            Go <FaArrowRight className="ml-2" />
          </Button>
        </CardItem>
      </div>
    </EmbedContainer>
  );
};

const ProjectEmbed = ({ embed }: EmbedProps) => {
  return (
    <CardContainer className="inter-var">
      <CardBody className="md:w-96 relative group/card">
        <div className="flex items-center">
          <CardItem rotateZ={30} translateZ={65} className="">
            <FaHammer className="mr-2" size={24} />
          </CardItem>
          <CardItem translateZ={65} className="text-xl font-bold">
            Project Card Title
          </CardItem>
        </div>
        <CardItem
          as="p"
          translateZ={60}
          className="text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          Brief description of the project. This is a brief description of the
          project.
        </CardItem>
        <CardItem translateZ={90} className="w-full mt-4">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-end items-center mt-20">
          <CardItem translateZ={30}>
            <Button>
              <FaGithub className="mr-2" />
              View on Github
            </Button>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
};

export const EmbedCard = ({ embed }: EmbedProps) => {
  switch (embed.type) {
    case EmbedType.File:
      return <FileEmbed embed={embed} />;
    case EmbedType.Project:
      return <ProjectEmbed embed={embed} />;
    case EmbedType.Link:
      return <LinkEmbed embed={embed} />;
  }
};

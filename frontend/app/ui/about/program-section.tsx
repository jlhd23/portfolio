import TeamMemberCard from "@/app/ui/about/team-member-card";
import { MemberInfo } from "@/app/ui/about/team-member-card";

interface ProgramSectionProps {
  titleSection: string;
  membersInfo: MemberInfo[];
}

export default function ProgramSection({titleSection, membersInfo}: ProgramSectionProps) {
  return (
          <section className="flex flex-col gap-1 w-full pb-20">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{titleSection}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-10">
              {membersInfo.map((memberInfo, index) => (<TeamMemberCard key={index} {...memberInfo} />))}
              {membersInfo.map((memberInfo, index) => (<TeamMemberCard key={index} {...memberInfo} />))}
              {membersInfo.map((memberInfo, index) => (<TeamMemberCard key={index} {...memberInfo} />))}
            </div>
          </section>
  );
}
import { usePlayers } from "@/hooks/usePlayers";
import { MatchTab, MatchType } from "@/types/match";
import MatchSummary from "./MatchSummary";
import MatchTabs from "./MatchTabs";
import MatchRecordTab from "./MatchRecordTab";
import MatchLineupTab from "./MatchLineupTab";

interface MatchDetailCardProps {
  match: MatchType | undefined;
  activeTab: MatchTab;
  onTabChange: (tab: MatchTab) => void;
  onRecordOpen: () => void;
  onRecordDelete: (eventId: string) => void;
  onLineupOpen: () => void;
}

export default function MatchDetailCard({
  match,
  activeTab,
  onTabChange,
  onRecordOpen,
  onRecordDelete,
  onLineupOpen,
}: Readonly<MatchDetailCardProps>) {
  const { players } = usePlayers();

  if (!match) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <div className="text-sm text-gray-500">선택된 경기가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6">
      {/* 경기 날짜 시간 장소 */}
      <div>
        <MatchSummary match={match} />
        <div className="mt-8 border-t">
          <MatchTabs activeTab={activeTab} onTabChange={onTabChange} />
          {/* 경기 기록 */}
          <div className="pt-6">
            {activeTab === "기록" && (
              <MatchRecordTab
                events={match.events}
                onRecordOpen={onRecordOpen}
                onRecordDelete={onRecordDelete}
              />
            )}
            {activeTab === "라인업" && (
              <MatchLineupTab
                lineup={match.lineup}
                players={players}
                onLineupOpen={onLineupOpen}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useMelodexStore } from '@/store';
import TableView from './TableView';
import PianoRoll from './PianoRoll';

export default function ViewTabs() {
  const resultsViewTab = useMelodexStore((s) => s.resultsViewTab);
  const setResultsViewTab = useMelodexStore((s) => s.setResultsViewTab);

  return (
    <Tabs value={resultsViewTab} onValueChange={setResultsViewTab} className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="table" className="flex-1">
          Table
        </TabsTrigger>
        <TabsTrigger value="roll" className="flex-1">
          Piano Roll
        </TabsTrigger>
      </TabsList>
      <TabsContent value="table">
        <TableView />
      </TabsContent>
      <TabsContent value="roll">
        <PianoRoll />
      </TabsContent>
    </Tabs>
  );
}

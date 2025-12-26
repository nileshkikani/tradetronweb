import VolumeSpikeTradesPage from "../../../src/components/VolumeSpikeTradesPage";
import { Authenticated } from "src/components/Authenticated";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
function VolumeSpikeActivePage() {
  return <VolumeSpikeTradesPage tradeType="active" />;
}

VolumeSpikeActivePage.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default VolumeSpikeActivePage;
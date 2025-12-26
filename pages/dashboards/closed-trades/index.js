import VolumeSpikeTradesPage from "../../../src/components/VolumeSpikeTradesPage";
import { Authenticated } from "src/components/Authenticated";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";

function VolumeSpikeClosedPage() {
  return <VolumeSpikeTradesPage tradeType="closed" />;
}

VolumeSpikeClosedPage.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default VolumeSpikeClosedPage;
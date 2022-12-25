import { DateTime } from "luxon";
import { GetServerSideProps } from "next";
import { returnRedirect } from "../../util/next";

export const getServerSideProps: GetServerSideProps = async () => {
  const currentMonth = DateTime.now().toFormat("yyyy-MM");
  return returnRedirect("/archive/" + currentMonth);
};

const ArchiveIndex: React.FC = () => {
  return null;
};

export default ArchiveIndex;

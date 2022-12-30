import { DateTime } from "luxon";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Label from "../../components/atoms/Label";
import HeadlineList from "../../components/HeadlineList";
import { IHeadline } from "../../services/articles/article.interface";
import { getHeadlinesByMonth } from "../../services/articles/server";
import { withDB } from "../../services/database";
import { getAllMonths } from "../../util/datetime";
import {
  DEFAULT_REVALIDATE_PERIOD,
  returnNotFound,
  returnProps,
} from "../../util/next";

type ArchiveProps = {
  monthTitle: string;
  headlines: IHeadline[];
  prevPath: string;
  nextPath: string;
};

const months = getAllMonths(
  DateTime.fromObject({ year: 2018, month: 1 }).startOf("month"),
  DateTime.now().startOf("month")
);

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: false,
    paths: months.map((month) => ({
      params: {
        month: month.toFormat("yyyy-MM"),
      },
    })),
  };
};

export const getStaticProps: GetStaticProps<ArchiveProps> = async ({
  params,
}) => {
  const month = params?.month;
  if (month) {
    const [year, monthNumber] = month
      .toString()
      .split("-")
      .map((s) => parseInt(s));
    if (isNaN(year) || isNaN(monthNumber)) {
      return returnNotFound();
    }
    return await withDB(async (conn) => {
      const headlines = await getHeadlinesByMonth(conn, year, monthNumber);
      const index = months.findIndex(
        (m) => m.year === year && m.month === monthNumber
      );
      if (index === -1) {
        return returnNotFound();
      }
      return returnProps(
        {
          monthTitle: DateTime.fromObject({
            year,
            month: monthNumber,
          }).toFormat("MMMM yyyy"),
          headlines,
          prevPath: months[index - 1]?.toFormat("yyyy-MM") ?? "",
          nextPath: months[index + 1]?.toFormat("yyyy-MM") ?? "",
        },
        DEFAULT_REVALIDATE_PERIOD
      );
    });
  }
  return returnNotFound();
};

const Archive: React.FC<ArchiveProps> = ({
  monthTitle,
  headlines,
  prevPath,
  nextPath,
}) => {
  return (
    <>
      <Head>
        <title>{`${monthTitle} Archive - The Husky Husky`}</title>
        <meta
          name="description"
          content={`View all stories published in the Husky Husky in ${monthTitle}`}
        />
      </Head>
      <div className="w-full">
        <Label>Archive</Label>
        <h1 className="mb-6 flex items-end space-x-2">
          {prevPath && (
            <Link href={"/archive/" + prevPath}>
              <FiChevronLeft className="mb-1" size={24} />
            </Link>
          )}
          <span className="text-2xl font-semibold">{monthTitle}</span>
          {nextPath && (
            <Link href={"/archive/" + nextPath}>
              <FiChevronRight className="mb-1" size={24} />
            </Link>
          )}
        </h1>
        <HeadlineList
          headlines={headlines}
          emptyText={`Crickets. Looks like nothing was published in ${monthTitle}.`}
        />
      </div>
    </>
  );
};

export default Archive;

import { useRouter } from "next/router";
import { DUMMY_MEETUPS } from "../index";
import MeetupItem from "@/components/meetups/MeetupItem";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

const MeetupDetail = ({ meetup }) => {
  console.log(meetup);
  return (
    <>
      <Head>
        <title>{meetup.title}</title>
        <meta name="description" content={meetup.description} />
      </Head>
      <MeetupItem
        key={meetup.id}
        id={meetup.id}
        image={meetup?.image}
        title={meetup?.title}
        address={meetup?.address}
        showDetails={false}
      />
    </>
  );
};
export async function getStaticPaths() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_SRV);
    const db = client.db();
    const meetupCollection = db.collection("meetups");
    const meetups = await meetupCollection.find().toArray();
    client.close();
    return {
      fallback: false,
      paths: meetups.map((meetup) => {
        return {
          params: {
            meetUpId: meetup._id.toString(),
          },
        };
      }),
    };
  } catch (error) {
    console.log(error);
  }
}
export async function getStaticProps(context) {
  const meetUpId = context.params.meetUpId;
  console.log(meetUpId);
  try {
    const client = await MongoClient.connect(process.env.MONGODB_SRV);
    const db = client.db();
    const meetupCollection = db.collection("meetups");
    const meetup = await meetupCollection.findOne({
      _id: new ObjectId(meetUpId),
    });
    console.log(meetup);

    client.close();

    return {
      props: {
        meetup: {
          id: meetup._id.toString(),
          title: meetup.title,
          address: meetup.address,
          description: meetup.description,
          image: meetup.image,
        },
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
}
export default MeetupDetail;

import MeetupList from "@/components/meetups/MeetupList";
import { MongoClient } from "mongodb";
// import { useEffect, useState } from "react";
import Head from "next/head";

function HomePage(props) {
  return (
    <>
      <Head>
        <title>Meetups</title>
        <meta name="description" content="The list of all the meetups" />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}

export async function getStaticProps() {
  let result;
  try {
    console.log(process.env.MONGODB_SRV);
    const client = await MongoClient.connect(process.env.MONGODB_SRV);
    const db = client.db();
    const meetupsCollection = db.collection("meetups");
    result = await meetupsCollection.find().toArray();
    console.log(result);
    client.close();
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      meetups: result.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10,
  };
}

export default HomePage;

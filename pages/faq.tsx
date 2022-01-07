import type { NextPage } from "next";
import Layout from "components/layout";
import { promises as fs } from "fs";
import path from "path";
import React from "react";
import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

export const getStaticProps: GetStaticProps = async () => {
  const faqFile = path.join(process.cwd(), "pages/faq.md");
  const faqMD = await fs.readFile(faqFile, "utf8");
  const mdxSource = await serialize(faqMD);
  return {
    props: {
      source: mdxSource,
    },
  };
};

const FAQ: NextPage = ({
  source,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout>
      <div className="title">
        <p className="text-4xl font-bold text-gray-800 mb-4">FAQ</p>
      </div>
      <article className="prose prose-headings:underline prose-a:text-blue-600 my-7">
        <MDXRemote {...source} />
      </article>
    </Layout>
  );
};
export default FAQ;

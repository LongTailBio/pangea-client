import React from 'react';

import MyCovid19Result from './components/mycovid';
import Covid19Results from './components/results';

const Covid19: React.FC = () => {
  return (
    <>
      <h1>COVID-19</h1>
      <p>
        This is a webapp to detect SARS-CoV-2 (The microbe that causes COVID-19)
        in an RNA sequencing sample. This tool is based off of best in class
        research but it is not approved for diagnostic use by any relevent
        organization. This tool is free to use.
      </p>
      <h3>How to use this app</h3>
      <p>
        To use this tool you will need to make an account on Pangea. To do so
        please see the link in the upper right hand corner of your screen. Once
        you have made an account and logged in you may use this app. To use this
        application simply upload a FASTQ file in the upload box below. Your
        FASTQ file must be compressed using gzip and should have either the file
        extension &quote;.fastq.gz&quote; or &quote;.fq.gz&quote;. Once your
        file is uploaded processing will begin automatically. Processing may
        take several hours. You will receive an email once processing is
        complete at the email address you used for your account. This email will
        include a link to download your results. You may upload multiple FASTQ
        files. If you have paired end sequencing data simply upload one of the
        read files, either one will do.
      </p>
      <h3>How to read the report</h3>
      <p>
        This app will send you a link to download a report file. This report
        file summarizes the fraction of RNA reads assigned to different
        organismal taxa in your file. There are six columns in this file. Each
        row represents one taxa. The first column gives the percentage of reads
        assigned to the taxa. The second column gives the total number of reads
        assigned to the taxa. The third column gives the total number of reads
        assigned to the taxa but not to a specific taxonomic group within the
        taxa. This field may usually be ignored. The fourth column gives a code
        for the taxonomic rank of the group. Generally this may be ignored. The
        fifth column gives the NCBI taxonomic Id number for the taxa. The sixth
        column gives the human readable name for te taxa. If you suspect your
        sample of carrying SARS-CoV-2 look for the read count for SARS-CoV-2. As
        SARS-CoV-2 is a virus and since viruses have small genomes this number
        is likely to be a small percentage of the total reads in your sample.
        However sometimes reads from other viruses may be misclassified as
        SARS-CoV-2. As a comparison check whether any other viruses are found in
        your sample and if those viruses have similar read counts to SARS-CoV-2.
      </p>

      <MyCovid19Result />
      <Covid19Results />

      <h3>How this app works</h3>
      <p>
        This app uses{' '}
        <a href="https://github.com/DerrickWood/kraken2"> Kraken2 </a>
        with a custom database to classify RNA reads. It primarily looks for
        reads that map to either the SARS-CoV-2 genome or the Human genome. If
        you want to use this database manually it can be downloaded
        <a href="https://s3.wasabisys.com/metasub/covid/kraken2_covid_2020_03_13.tar.gz">
          {' '}
          here
        </a>
        . The source code for this web app may be found
        <a href="https://github.com/LongTailBio/pangea-django/tree/feat/add-covid19-contrib-module/pangea/contrib/covid19">
          {' '}
          here
        </a>
        .
      </p>
      <h3>Comments, questions, and suggestions</h3>
      <p>
        To make comments on this app please send us an email at
        dev@longtailbio.com or open an issue on{' '}
        <a href="https://github.com/LongTailBio/pangea-django">GitHub</a>.
      </p>
      <h3>Disclaimer</h3>
      <p>
        This app is not approved for any sort of diagnostic usage. No claims of
        accuracy are given. No specific guarantees on data privacy or HIPAA
        compliance are given.
      </p>
    </>
  );
};

export default Covid19;

import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import ReactPlayer from "react-player"

const whereIsLoginButton = require('../images/find_login.png');
const profilePage = require('../images/profile_page_example.png');
const createOrgPage = require('../images/create_org.png');
const createSampleGroupPage = require('../images/create_sample_group.png');
const createSamplePage = require('../images/create_sample.png');
const createARPage = require('../images/create_ar.png');
const uploadARFieldPage = require('../images/upload_ar_field.png');
const integratedFormPage = require('../images/integrated_create_sample.png')
const screenshotStyle = {
  width: '60%',
  border: '2px solid #888',
};


const DocsHowToUploadReads: React.FC = () => (
  <Row>
      <h2 id='datamodel'>How To Upload Sequencing Reads to Pangea</h2>
      <br/>
      <br/>      
      <ReactPlayer
        url="https://youtu.be/DgKR5KV-7bw"
      />
      <br/>
      <br/>        
      <p>
        This guide will show you how to upload sequencing reads to Pangea.
        It will cover every step of the process from creating a user account 
        to uploading FASTQ files.
      </p>

      <h3>Logging in or Registering</h3>
      <img src={whereIsLoginButton} alt="Finding the login button" style={screenshotStyle} />
      <br/><br/>
      <p>
        You will need to be logged in to your user account to upload data.
        In the upper right hand corner of the screen you will find a button
        called Login. Once you click that button you will see a dropdown to
        register or login. Click login if you already have an account or 
        register if you do not and enter your information.
      </p>
      <img src={profilePage} alt="Profile Page Example" style={screenshotStyle} />
      <br/><br/>
      <p>
        Once you log in or register you will be taken to your profile page.
        This page will show you a list of organizations you are in as well
        as some basic profile information about yourself. If you just registered
        this page will be mostly empty, that's alright for this tutorial.
      </p>


      <h3>Creating an Organization</h3>
      <img src={createOrgPage} alt="Create Org Example" style={screenshotStyle} />
      <br/><br/>
      <p>
        On your profile page you will see a button called 'New Organization'.
        Click that button and you will be taken to a page to create an organization.
        To create an organization all you need to do is enter a name and click create.
        Once the organization is created you will be taken to its home page.
      </p>
      <p>
        If you prefer to upload data to an organization that already exists click
        on that organization's name from your profile page instead.
      </p>

      <h3>Creating a Sample Group</h3>
      <img src={createSampleGroupPage} alt="Create Sample Group Example" style={screenshotStyle} />
      <br/><br/>
      <p>
        From the organization home page you will see a 'New Sample Group' button.
        Click that button and you will be taken to a page to create an sample group.
        There are lots of options here but the only ones you need to fill out are 
        the name of the sample group and a short description. The
        defaults for the other options should be fine.
        Once the sample group is created you will be taken to its home page.
      </p>
      <p>
        If you prefer to upload data to a Sample Group that already exists click
        on that group's name from the organization page instead.
      </p>

      <h3>Creating a Sample and Uploading Reads</h3>

      <p>
        You can create samples and upload data using the web app or with the CLI.
        The CLI is more convenient for large numbers of samples. If you use the web
        app there are two ways to do it: an all-in-one sample creation form or a manual 
        step by step process.
      </p>

      <h4>Using the All-in-One Form</h4>
      <img src={integratedFormPage} alt="Create All in One Example" style={screenshotStyle} />
      <br/><br/>
      <p>
        From the sample group home page you will see a 'New Sample' button.
        Click that button and you will be taken to a page to create an sample.
        This page has multiple tabs. Select the 'One Sample with Data' tab.
      </p>
      <p>
        To create a sample you should enter your desired sample name and select the
        appropriate data type using the dropdown menu. Depending on the data type
        you select the appropriate fields will appear (the full list may also be
        found below on this page). You should select the matching fastq files for each
        field using the dialogue. 
      </p>
      <p>
        Optionally you may also select one or more 'Work Orders'. These are analyses
        that will be automatically performed on your data such as quality control.
      </p>

      <h4>Manually, Using the Web App</h4>
      <p>
        If you are creating a small number of samples you can use the web application.
        If instead you are creating a large number of samples the command line will be
        more convenient (see below).
      </p>
      <img src={createSamplePage} alt="Create Sample Example" style={screenshotStyle} />
      <br/><br/>
      <p>
        From the sample group home page you will see a 'New Sample' button.
        Click that button and you will be taken to a page to create an sample.
        To create an sample all you need to do is enter a name and click create.
        Once the sample is created you will be taken to its home page.
      </p>
      <p>
        If you prefer to upload data to a Sample that already exists click
        on that sample's name from the sample group page instead.
      </p>

      <h4>Creating an Analysis Result on the Web App</h4>
      <img src={createARPage} alt="Create Analysis Result Example" style={screenshotStyle} />
      <br/><br/>
      <p>
        From the sample home page you will see a 'Create Analysis Result' button.
        Click that button and you will be taken to a page to create an analysis result.
        To create an analysis result you need to enter a module name and a replicate then
        click create. The module name you use will depend on the type of reads you are
        uploading:
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>Data Type</th>
            <th>Module Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Paired End Short Reads</td>
            <td>raw::paired_short_reads</td>
          </tr>
          <tr>
            <td>Single End Short Reads</td>
            <td>raw::single_short_reads</td>
          </tr>
          <tr>
            <td>Basecalled Nanopore Reads</td>
            <td>raw::basecalled_nanopore_reads</td>
          </tr>
          <tr>
            <td>Raw Nanopore Reads</td>
            <td>raw::raw_nanopore_reads</td>
          </tr>
        </tbody>       
      </table> 
      <p>
        These module names are just conventions, you can use a different name if you prefer
        though some pipelines may not work. The replicate can be anything, it is meant to
        distinguish sequencing runs from the same sample.

        Once the analysis result is created you will be taken to its home page.
      </p>
      <p>
        If you prefer to upload data to an Analysis Result that already exists click
        on that results's name from the sample page instead.
      </p>

      <h4>Uploading Data to the Analysis Result on the Web App</h4>
      <img src={uploadARFieldPage} alt="Upload Data to Analysis Result Example" style={screenshotStyle} />
      <br/><br/>
      <p>
        On the analysis result home page you will see a box called 'Upload New Analysis Result Field'
        at the bottom of the page. This is where you upload data.

        You will upload your reads one file at a time. To do so, select your reads using the file
        selection box (the grey box that says 'Drop files here, paste or browse') enter the appropriate
        field name and click upload.
      </p>
      <table className="table">
        <thead>
        <tr>
          <th>Data Type</th>
          <th>Field Name</th>
        </tr>
        </thead>
        <tbody>
          <tr>
            <td>Paired End Short Reads</td>
            <td>read_1 or read_2</td>
          </tr>
          <tr>
            <td>Single End Short Reads</td>
            <td>reads</td>
          </tr>
          <tr>
            <td>Basecalled Nanopore Reads</td>
            <td>reads</td>
          </tr>
          <tr>
            <td>Raw Nanopore Reads</td>
            <td>fast5</td>
          </tr>
        </tbody>        
      </table>
      <p>Once the upload is compete you will see a link to the file on the page.</p>
      <h4 id='upload-reads-cli'>Using the Command Line</h4>
      <p>
        You can automatically create samples and upload reads using the <a href='https://github.com/LongTailBio/pangea-django/tree/master/api-client'>Pangea Command Line. </a>
        This is more convenient when dealing with a large number of samples or samples stored on a server.
      </p>
      <p>
        <ol>
          <li>Install the pangea api on your server by running <code>pip install pangea-api</code></li>
          <li>Navigate to the directory with your fastq files</li>
          <li>Make a file with all the fastq filepaths. Usually <code>find . -name "*.fastq.gz" > file_list.txt</code> works but the file extension for your reads might be different</li>
          <li>Upload the reads with the following command, samples will automatically be created. <code>{'pangea-api upload reads -e <your pangea email> -p <your pangea password> -1 _R1.fastq.gz -2 _R2.fastq.gz <organization name> <sample library name> file_list.txt'}</code>
            <ul>
              <li>note that your read extensions (<code>-1 _R1.fastq.gz -2 _R2.fastq.gz</code>) might be different</li>
              <li>you can parrallelize the above command using <code>split</code> and <code>xargs</code></li>
              <li>run <code>pangea-api upload reads --help</code> to see more options</li>
            </ul>
          </li>
        </ol>
      </p>
      <h3>Uploading metadata</h3>
      <p>Once you have uploaded reads you may want to upload metadata. See <a href='/docs/how-to-upload-metadata'> this guide</a> for more.</p>
  </Row>
);

export default DocsHowToUploadReads;
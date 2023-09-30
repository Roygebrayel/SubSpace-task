import axios from "axios";
import _ from 'lodash';
import dotenv from 'dotenv';
import { Logger } from "./logging.js";
dotenv.config();


export const dataRetrieval = async () => {
  try {
    // Make the CURL request to fetch blog data
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });

    Logger.info('everything is okay')
    return response.data;
   
  }
  catch {
    Logger.error(`there is an error with fetching , error : ${error.message}`)
     console.error('Error fetching blog data:', error);
    throw new Error('Failed to fetch blog data');
    
  }
}

 const blogData = await dataRetrieval();


const calculateCacheKey = (args) => {
  return args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join('-');
};
// Function to calculate cache key for analytics
const calculateAnalyticsCacheKey = (blogData) => {
  return calculateCacheKey([blogData]);
};


// Memoize function for analytics
const memoizedAnalytics = _.memoize( (blogData) => {
  console.log('Analyzing data...');
   
   if (!blogData) {
   Logger.error(`no blogData has been found , ${error.message}`);
      throw new Error('No blog data available');
      
    }
  const totalBlogs = blogData.blogs.length;

// Find the blog with the longest title
  const blogWithLongestTitle = _.maxBy(blogData.blogs, blog => blog.title.length);

//  Determine the number of blogs with titles containing the word "privacy"
const blogsWithPrivacyInTitle = _.filter(blogData.blogs, blog => _.includes(_.toLower(blog.title), 'privacy')).length;

// Create an array of unique blog titles (no duplicates)
  const uniqueBlogTitles = _.uniq(_.map(blogData.blogs, 'title'));

  

    
 const jsonData = {
      totalBlogs,
      longestBlogTitle: blogWithLongestTitle.title,
      blogsContainingPrivacy: blogsWithPrivacyInTitle,
      uniqueBlogTitles
    };
  return { jsonData};
}, calculateAnalyticsCacheKey);




export const dataAnalysis = async (req,res,next)=> {
  try {

    Logger.info(`successfully send the jsonData`);
   
const analyticsResult = memoizedAnalytics(blogData);
    res.json({ analyticsResult });
  

  } catch (error) {
    Logger.error(`internal server error , ${error.message}`);
    next(error);
  }
}

  





export const searchBlog =  async (req, res ) => {
 
const blogData = await dataRetrieval();
if(!blogData){
Logger.error(`no BlogData has been found`);
}
  const query = req.query.query; // Get the query parameter

 const searchBlogs = (query, blogData) => {
  return _.filter(blogData.blogs, blog => _.includes(_.toLower(blog.title), _.toLower(query)));
};

  if (!query) {
    Logger.error(`Query parameter is missing.`)
    res.status(400).json({ error: 'Query parameter is missing.' });
    return;
  }

  const filteredBlogs = searchBlogs(query , blogData);

Logger.info(`everything ok`);
  res.json({ results: filteredBlogs });
};


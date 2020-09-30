---
title: Let's Create a Simple Python Web Scraper
author: Aaron Goidel
slug: lets-create-a-simple-python-web-scraper
date: "2020-09-29 21:39:09"
wcount: 548
---

As part of my job at [Highsnobiety](https://www.highsnobiety.com/), I've had to do quite a bit of web scraping. We use scraping to extract product information from the websites of various retailers so we can include dynamic product information on our own site.

In this post, I am going to walk through how to create a program to scrape product data from a fashion retailer, [Stüssy](https://www.stussy.com/). To build our scraper, we are going to use Python with [Scrapy](https://scrapy.org/).

## What is Scrapy?

Scrapy is a framework which allows us to easily build scrapers in Python. We can define data models, write middlewares to process data, and create pipelines which handle the processed data. Most importantly, Scrapy lets us create **spiders**, or robots which crawl the web and extract data.

Today, we will focus on the most basic functionality, but the documentation on Scrapy's website goes further.

## Let's Get Started

Assuming you already have Python, the first thing to do is install Scrapy. This can be done with pip.

```bash
pip install scrapy
```

Now with Scrapy installed, we will use its commandline tool to create a project. Open terminal and `cd` into whatever directory you'd like your scraper to live. Now run:

```bash
scrapy startproject <project name here>
```

This will generate all the starter code needed to write your first web scraper.

## Making a Spider

Now that we have a project, we need a spider, or the program which will do the scraping.

In the `spiders/` subdirectory of your project, create a file called `product_spider.py` and open it in your favorite editor.

Every Scrapy spider is a class which extends the `scrapy.Spider` superclass, like so.

```python
import scrapy

class ProductSpider(scrapy.Spider):
```

Spiders also need a `name` and `start_urls`. `name` is a string that identifies a spider, and `start_urls` is a list of strings containing at which web pages to start the scraping process. Let's add that information to our spider.

For this spider, we will scrape the [new arrivals page](https://www.stussy.com/collections/mens-new-arrivals).

```python
class ProductSpider(scrapy.Spider):
    name = "products"

    start_urls = ["https://www.stussy.com/collections/mens-new-arrivals"]
```

## Parsing

Now we will write the `parse` method, which is the entry point for all data handled by a spider. `parse` takes in a response, containing the HTML for the page we want to scrape.

We can select for the data we want by inspecting the page and finding which CSS classes are applied to the data we want. And, we can see that the container for products has the `.collection__product` class.

![Products CSS Selector in Dev Tools](/post-images/scraping/products-selector.png)

Scrapy's `css()` method on responses allows us to extract data by CSS class. So, in a class method called `parse`, let's select for the products using the information we got from dev tools.

```python
def parse(self, response):
    products = response.css(".collection__product")
```

Now, we have a list of elements containing our products. We can iterate over this list and extract data, using the same dev tools approach from earlier. We will `yield` each entry, which allows us to return an item into the pipeline whithout losing our place in the loop.

![Title CSS Selector in Dev Tools](/post-images/scraping/title-selector.png)

```python
def parse(self, response):
    products = response.css(".collection__product")

    for item in products:
        yield {
            "name": item.css(".product-card__title::text").get()
        }
```

Notice the `::text` selector in our CSS class. That simply selects for the inner text of the element, rather than the element itself.

Now all we need to do is run our scraper with

```bash
scrapy crawl products
```

## Now What?

This is a very limited view of web scraping. You can extract just about any data you'd like from the internet using techniques similar to those I've shown you here today.

This method of data collection opens up infinite possibilities for projects which use data you've scraped from the web, whether it be products, news articles, or pictures of cats.

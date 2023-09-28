import fs from 'fs-extra'
import path from 'path'
import inquirer from 'inquirer'

async function go() {
  console.log("\nLet's create a new blog 💿\n")

  const blogsPath = path.resolve(process.cwd(), 'src', 'content', 'blog')

  if (!fs.existsSync(blogsPath)) {
    fs.mkdirSync(blogsPath)
  }

  const blogs = fs
    .readdirSync(blogsPath)
    .map(blog => blog.replace(/(\.md?)?$/, ''))

  const slug = (
    await inquirer.prompt<{ name: string }>([
      {
        type: 'input',
        name: 'name',
        message: 'What is the slug of this post?',
        validate: input => {
          if (!input) {
            return 'Enter a valid name for the blog.'
          }
          if (blogs.includes(input)) {
            return `Blog named ${input} alread exist, enter another blog name.`
          }
          return true
        },
      },
    ])
  ).name

  const title = (
    await inquirer.prompt<{ name: string }>([
      {
        type: 'input',
        name: 'name',
        message: 'What is the title of the blog?',
        validate: input => {
          if (!input) {
            return 'Enter a valid name for the blog.'
          }
          return true
        },
      },
    ])
  ).name

  const { tags, description, draft, featured } = await inquirer.prompt<{
    description: string
    draft: boolean
    featured: string
    tags: string
  }>([
    {
      type: 'input',
      name: 'tags',
      message: 'Enter the blog keywords (comma separated)',
      filter: (input: string) => input.trim(),
      validate: (input: string) => {
        if (input.trim().length === 0) {
          return 'Enter a keyword'
        }
        return true
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter the blog description',
      filter: (input: string) => input.trim(),
      validate: (input: string) => {
        if (input.trim().length === 0) {
          return 'Enter a description for the blog'
        }
        return true
      },
    },
    {
      type: 'list',
      name: 'draft',
      message: 'Is the blog ready to be published?',
      choices: [
        { name: 'Publish', value: false },
        { name: 'Draft', value: true },
      ],
    },
    {
      type: 'list',
      name: 'featured',
      message: 'Will this blog be featured?',
      choices: [
        { name: 'No', value: false },
        { name: 'Yes', value: true },
      ],
    },
  ])

  const data = `---
title: ${title}
pubDatetime: ${new Date().toISOString()}
postSlug: ${slug}
featured: ${featured}
draft: ${draft}
tags:
${tags
  .split(/, ?/)
  .map(tag => `    - ${tag}`)
  .join('\n')}
description: ${description}
---

`

  let relativePath = ''


  const filePath = path.resolve(blogsPath, `${slug}.md`)
  relativePath = path.relative(process.cwd(), filePath)
  fs.writeFileSync(filePath, data)
  

  console.log(
    `\nBlog created 🚀\n\`cd\` into ${relativePath}\nOpen it in you favorite text editor, and get started!\n`,
  )
}

go().catch(err => {
  console.error(err)
  process.exit(1)
})
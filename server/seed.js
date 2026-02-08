require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');
const Task = require('./models/Task');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.VITE_MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data.');

    // Create Projects
    const project1 = await Project.create({
      name: 'Design Weekly',
      description: 'A board to keep track of design progress.',
      themeColor: 'pink'
    });

    const project2 = await Project.create({
      name: 'Personal',
      description: 'Household chores and personal goals.',
      themeColor: 'blue'
    });

    console.log('Projects created.');

    // Create Tasks
    await Task.create([
      {
        projectId: project1._id,
        title: 'Review scope',
        description: 'Review #390.',
        status: 'todo',
        tags: ['Design'],
        dueDate: new Date(),
        checklist: [],
      },
      {
        projectId: project1._id,
        title: 'Usability test',
        description: 'Research questions with Carina.',
        status: 'in-progress',
        tags: ['Research'],
        checklist: [],
      },
      {
        projectId: project1._id,
        title: 'Culture workshop',
        description: 'Let’s build a great team.',
        status: 'testing',
        tags: [],
        dueDate: new Date(Date.now() + 86400000 * 2),
        checklist: [
            { text: 'Schedule time', completed: true },
            { text: 'Set up a Figma board', completed: false },
            { text: 'Review exercises with the team', completed: false }
        ],
      },
      {
        projectId: project2._id,
        title: 'Take Coco to a vet',
        description: 'Regular checkup.',
        status: 'todo',
        tags: ['Pet'],
        dueDate: new Date(Date.now() + 86400000 * 5),
        checklist: [],
      },
    ]);

    console.log('Tasks created.');
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
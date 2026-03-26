from app import app
from extensions import db
from models import LearningModule

with app.app_context():
    db.create_all()
    
modules_data = [
    {
        "title": "Climate Change & Global Warming",
        "description": "This module explores the scientific basis of climate change, greenhouse gas emissions, anthropogenic impacts, global temperature rise, and mitigation strategies such as carbon reduction and renewable transition.",
        "difficulty": "Beginner",
        "points": 50
    },
    {
        "title": "Waste Management & Circular Economy",
        "description": "Learn about solid waste management, recycling systems, composting, plastic pollution, and how circular economy principles reduce environmental degradation.",
        "difficulty": "Beginner",
        "points": 50
    },
    {
        "title": "Water Conservation & Sustainable Usage",
        "description": "Understand groundwater depletion, water scarcity challenges, rainwater harvesting systems, and sustainable water management practices.",
        "difficulty": "Beginner",
        "points": 50
    },
    {
        "title": "Renewable Energy Systems",
        "description": "Study solar, wind, hydro, and biomass energy systems and their role in reducing fossil fuel dependency.",
        "difficulty": "Intermediate",
        "points": 70
    },
    {
        "title": "Biodiversity & Ecosystem Protection",
        "description": "Explore ecosystem balance, habitat destruction, species extinction, and biodiversity conservation strategies.",
        "difficulty": "Intermediate",
        "points": 70
    },
    {
        "title": "Sustainable Agriculture & Food Systems",
        "description": "Learn about organic farming, soil conservation, water-efficient irrigation, and food sustainability practices.",
        "difficulty": "Intermediate",
        "points": 80
    },
    {
        "title": "Urban Sustainability & Smart Cities",
        "description": "Examine green infrastructure, sustainable transport systems, waste-efficient urban planning, and smart city innovations.",
        "difficulty": "Advanced",
        "points": 90
    },
    {
        "title": "Carbon Footprint & Lifestyle Choices",
        "description": "Calculate and reduce personal carbon footprints through lifestyle modifications and responsible consumption.",
        "difficulty": "Advanced",
        "points": 100
    },
    {
        "title": "Environmental Policy & SDGs",
        "description": "Understand global environmental policies, India’s NEP 2020 integration, and the UN Sustainable Development Goals.",
        "difficulty": "Advanced",
        "points": 100
    },
    {
        "title": "Community Action & Grassroots Sustainability",
        "description": "Learn how local community initiatives drive sustainable development through eco-clubs, clean-up drives, and collective action.",
        "difficulty": "Advanced",
        "points": 120
    }
]

with app.app_context():
    for data in modules_data:
        module = LearningModule(**data)
        db.session.add(module)

    db.session.commit()

print("Modules seeded successfully!")
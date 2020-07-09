const mysql = require('../models/mysql');
const responseMessages = require('../library/response-messages');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    addProject,
    addReview,
    findOneWhere,
    deleteProject,
    updateProject,
    getRec,
    createTag,
    createProgTag,
    findTag,
    getProjectPhoto,
    getTags
}

function addReview(body) {
    return mysql.reviews.create(body);
}

function getProjectPhoto(tags, pagination) {
    return mysql.tags.findAll({
        where: {
            tagId: tags
        },
        attributes: ['tagId', 'name'],
        limit: pagination.count,
        offset: pagination.offset,
        include: [{
            model: mysql.projectTags,
            as: 'tagsOfProject',
            attributes: ['tagId', 'projectId'],
            include: [{
                model: mysql.projects,
                as: 'tagProjectLink',
                attributes: ['projectId', 'title', 'about', 'createdAt'],
                include: [{
                    model: mysql.media,
                    as: 'projectMedia'
                }]
            }]
        },
        ]

    })
}

function addProject(proj, userId) {
    proj.createdAt = new Date();
    proj.userId = userId;
    return mysql.projects.create(proj);
}

async function findOneWhere(where, pagination) {
    return mysql.projects.findOne({
        where,

        include: [{
            model: mysql.locations,
            as: 'projectLocation'
        }, {
            model: mysql.users,
            as: 'userProject',
            attributes: ['firstName', 'lastName', 'photoUrl', 'userId'],
        }, {
            model: mysql.projectTags,
            as: "projectTag",
            attributes: {exclude: ['tagId', 'projectTagId']},
            include: [{
                model: mysql.tags,
                as: "tagsP"
            }]
        }],

    }).then(async proj => {
            let project = await proj.get({plain: true});

            project.media = [];
            let media = await mysql.media.findAndCountAll({
                where: {
                    projectId: proj.projectId
                },
                limit: 10,
                offset: 0
            });

            for (let med of media.rows) {
                let m = med.get({plain: true});
                project.media.push(m);
            }
            project.mediaCount = media.count;
            return project;
        }
    )
}

function deleteProject(where) {
    return mysql.projects.destroy(where);
}

async function updateProject(update, projectId) {
    const project = await mysql.projects.findByPk(projectId)
    return project.update(update);
}

function getTags() {
    return mysql.tags.findAll({
        limit: 10,
    });
}

async function getRec(params, pagination) {
    let s = params.name + '%';
    const l = await mysql.tags.findAll({
        where: {
            name: {
                [Op.like]: s
            }
        },
        limit: pagination.count,
        offset: pagination.pageNo
    });
    return l;
}

function createTag(param) {
    return mysql.tags.create(
        {
            name: param.name,
            slug: "none"
        });
}

function createProgTag(tag) {
    return mysql.projectTags.bulkCreate(tag);
}

function findTag(tag) {
    return mysql.tags.findOne({
        where: {
            name: tag.name
        }
    });
}

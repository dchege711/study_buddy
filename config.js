module.exports = {
    "GCLOUD_PROJECT": process.env.STUDY_BUDDY_GCLOUD_PROJECT_ID,
    "DATA_BACKEND": "cloudsql",
    "MYSQL_USER": process.env.STUDY_BUDDY_GCLOUD_SQL_DB_USERNAME,
    "MYSQL_PASSWORD": process.env.STUDY_BUDDY_GCLOUD_SQL_PASSWORD,
    "INSTANCE_CONNECTION_NAME": process.env.STUDY_BUDDY_GCLOUD_SQL_CONN_NAME,
    "MONGO_URI": process.env.STUDY_BUDDY_MLAB_MONGO_URI,
    "METADATA_ID": process.env.STUDY_BUDDY_C13U_METADATA_ID,
    "USER_METADATA_ID": process.env.STUDY_BUDDY_USERS_METADATA_ID
}

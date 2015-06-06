# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150606170053) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "exercises", force: true do |t|
    t.integer  "user_id"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "exercises", ["user_id"], name: "index_exercises_on_user_id", using: :btree

  create_table "fat_readings", force: true do |t|
    t.float    "percent"
    t.string   "entry_date"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "fat_readings", ["user_id"], name: "index_fat_readings_on_user_id", using: :btree

  create_table "notes", force: true do |t|
    t.text     "body"
    t.string   "entry_date"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "notes", ["user_id"], name: "index_notes_on_user_id", using: :btree

  create_table "taggings", force: true do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.string   "taggable_type"
    t.integer  "tagger_id"
    t.string   "tagger_type"
    t.string   "context",       limit: 128
    t.datetime "created_at"
  end

  add_index "taggings", ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true, using: :btree
  add_index "taggings", ["taggable_id", "taggable_type", "context"], name: "index_taggings_on_taggable_id_and_taggable_type_and_context", using: :btree

  create_table "tags", force: true do |t|
    t.string  "name"
    t.integer "taggings_count", default: 0
  end

  add_index "tags", ["name"], name: "index_tags_on_name", unique: true, using: :btree

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "weight_readings", force: true do |t|
    t.float    "weight"
    t.string   "entry_date"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "weight_readings", ["user_id"], name: "index_weight_readings_on_user_id", using: :btree

  create_table "workout_sets", force: true do |t|
    t.integer  "workout_id"
    t.integer  "exercise_id"
    t.float    "weight"
    t.integer  "reps"
    t.string   "entry_date"
    t.boolean  "warmup"
    t.integer  "order"
    t.string   "comment"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "workout_sets", ["exercise_id"], name: "index_workout_sets_on_exercise_id", using: :btree
  add_index "workout_sets", ["workout_id"], name: "index_workout_sets_on_workout_id", using: :btree

  create_table "workouts", force: true do |t|
    t.integer  "user_id"
    t.string   "entry_date"
    t.string   "comment"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "workouts", ["user_id"], name: "index_workouts_on_user_id", using: :btree

end

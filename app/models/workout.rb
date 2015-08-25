class Workout < ActiveRecord::Base
	default_scope  { order(:entry_date => :desc) }
	validates :user, :entry_date, presence: true
 	belongs_to :user
	has_many :workout_exercises, dependent: :destroy, :autosave => true
	accepts_nested_attributes_for :workout_exercises
end

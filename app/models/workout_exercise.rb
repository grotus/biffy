class WorkoutExercise < ActiveRecord::Base
	default_scope  { order(:created_at => :asc) }
	acts_as_taggable
	validates :workout, :exercise, presence: true
  belongs_to :workout
  belongs_to :exercise
  has_many :workout_sets, dependent: :destroy
  accepts_nested_attributes_for :workout_sets
  accepts_nested_attributes_for :exercise
end

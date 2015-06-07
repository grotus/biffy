class WorkoutExercise < ActiveRecord::Base
	validates :workout, :exercise, presence: true
  belongs_to :workout
  belongs_to :exercise
  has_many :workout_sets, dependent: :destroy
end

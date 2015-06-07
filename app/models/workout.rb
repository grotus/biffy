class Workout < ActiveRecord::Base
	validates :user, :entry_date, presence: true
  belongs_to :user
  has_many :workout_exercises, dependent: :destroy
end

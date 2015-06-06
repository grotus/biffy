class Workout < ActiveRecord::Base
	validates :user, :entry_date, presence: true
  belongs_to :user
  has_many :workout_sets, dependent: :destroy
  has_many :exercises, through: :workout_sets
end

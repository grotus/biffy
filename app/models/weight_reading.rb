class WeightReading < ActiveRecord::Base
  belongs_to :user
  scope :on,  ->(date) {where(entry_date: date)}
end
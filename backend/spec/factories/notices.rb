FactoryBot.define do
  factory :notice do
    association :organization
    title { "テストお知らせ" }
    body  { "本文テキスト" }
    target_type { "all" }
    status { "draft" }

    trait :published do
      status { "published" }
      published_at { Time.current }
    end

    trait :leaders_only do
      target_type { "leaders" }
    end

    trait :scheduled do
      status { "scheduled" }
      scheduled_at { 1.day.from_now }
    end

    trait :archived do
      status { "archived" }
      published_at { 1.week.ago }
    end
  end
end

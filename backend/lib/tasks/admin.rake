namespace :admin do
  desc "管理者パスワードをリセットする"
  task reset_password: :environment do
    org = Organization.first
    abort "自治会データが見つかりません" unless org

    print "新しい管理者パスワードを入力してください: "
    password = $stdin.gets.chomp

    print "もう一度入力してください: "
    confirmation = $stdin.gets.chomp

    abort "パスワードが一致しません" unless password == confirmation
    abort "パスワードを入力してください" if password.empty?

    org.admin_password = password
    if org.save
      puts "管理者パスワードを変更しました"
    else
      abort "変更に失敗しました: #{org.errors.full_messages.join(', ')}"
    end
  end
end

---
title: 'Quản Lý Bộ Nhớ và Thu Gom Rác (Garbage Collection) trong Java'
description: 'Tìm hiểu cách Java quản lý bộ nhớ tự động và các chiến lược garbage collection để tối ưu hiệu suất'
pubDate: 'Dec 21 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

Quản lý bộ nhớ (Memory management) là một trong những tính năng quan trọng nhất của Java, giúp các nhà phát triển tránh được các lỗi rò rỉ bộ nhớ (memory leak) và hỏng bộ nhớ phổ biến trong C/C++. Máy ảo Java (JVM) tự động quản lý bộ nhớ thông qua bộ thu gom rác (Garbage Collection - GC), nhưng hiểu sâu về cách nó hoạt động giúp bạn viết code hiệu quả hơn và tối ưu hiệu suất.

## Tại Sao Cần Quản Lý Bộ Nhớ Tự Động?

Trong các ngôn ngữ như C hay C++, các nhà phát triển phải cấp phát và giải phóng bộ nhớ thủ công. Quên giải phóng bộ nhớ dẫn đến rò rỉ bộ nhớ. Giải phóng bộ nhớ quá sớm hoặc hai lần dẫn đến sập chương trình hoặc lỗ hổng bảo mật. Con trỏ treo (Dangling pointers), tràn bộ đệm (buffer overflows), và hỏng bộ nhớ là những lỗi nghiêm trọng và khó gỡ lỗi.

Java giải quyết những vấn đề này bằng quản lý bộ nhớ tự động. Các nhà phát triển cấp phát bộ nhớ bằng cách tạo đối tượng với từ khóa `new`, nhưng không cần giải phóng thủ công. JVM theo dõi các tham chiếu đối tượng và tự động thu hồi bộ nhớ của các đối tượng không còn truy cập được. Cách tiếp cận này giảm đáng kể lỗi và cải thiện năng suất của nhà phát triển.

Sự đánh đổi là mất quyền kiểm soát. Quản lý bộ nhớ thủ công cho phép dọn dẹp xác định và kiểm soát chi tiết. GC tự động có chi phí xử lý và thời gian tạm dừng không thể đoán trước. Tuy nhiên, đối với hầu hết các ứng dụng, lợi ích của quản lý tự động vượt xa chi phí. Các thuật toán GC hiện đại được tối ưu hóa cao, cung cấp hiệu suất tuyệt vời cho phần lớn các trường hợp sử dụng.

## Cấu Trúc Bộ Nhớ JVM

JVM chia bộ nhớ thành nhiều khu vực, mỗi khu vực phục vụ mục đích cụ thể. **Heap** là nơi các đối tượng được cấp phát. **Method Area** (hay Metaspace trong Java 8+) lưu trữ metadata của lớp, biến tĩnh (static variables), và bể hằng số (constant pool). **Stack** lưu trữ các khung phương thức (method frames) với các biến cục bộ và kết quả một phần. **Program Counter registers** theo dõi điểm thực thi hiện tại.

Heap tiếp tục được chia thành các thế hệ (generations): **Young Generation** (Thế hệ Trẻ) và **Old Generation** (Thế hệ Già - hay Tenured). Young Generation là nơi các đối tượng mới được cấp phát, được chia nhỏ thành không gian **Eden** và hai không gian **Survivor** (S0 và S1). Hầu hết các đối tượng "chết trẻ" - chúng được cấp phát và nhanh chóng trở nên không thể truy cập. Cách tiếp cận theo thế hệ tối ưu hóa cho mô hình này.

Stack memory là riêng biệt cho từng luồng (per-thread), lưu trữ các khung gọi phương thức. Mỗi khung chứa biến cục bộ, ngăn xếp toán hạng, và địa chỉ trả về. Stack được quản lý tự động - khung được đẩy vào khi phương thức được gọi, lấy ra khi trả về. Kích thước Stack có giới hạn, đệ quy quá sâu gây ra `StackOverflowError`. Heap được chia sẻ giữa các luồng, yêu cầu đồng bộ hóa khi truy cập đồng thời.

## Vòng Đời Đối Tượng và Cấp Phát

Khi tạo đối tượng với từ khóa `new`, JVM cấp phát bộ nhớ trong không gian Eden của Young Generation. Việc cấp phát cực kỳ nhanh trong Eden - về cơ bản là tăng con trỏ (pointer bump). Các JVM hiện đại sử dụng **Thread-Local Allocation Buffers (TLABs)** để tránh chi phí đồng bộ hóa, mỗi luồng có bộ đệm riêng trong Eden.

Ban đầu, đối tượng có tham chiếu mạnh (strong reference) - biến trỏ đến nó. Đối tượng có thể truy cập được miễn là còn đường dẫn tham chiếu từ **GC roots** (biến cục bộ, trường tĩnh, luồng đang hoạt động) đến đối tượng. Khi không còn đường dẫn nào, đối tượng trở nên không thể truy cập và đủ điều kiện để thu gom rác. JVM không thu hồi bộ nhớ ngay lập tức - chờ cho đến khi GC chạy.

Các tham chiếu đối tượng có các loại khác nhau: **strong** (bình thường), **soft** (có thể sống sót qua GC nếu bộ nhớ đủ), **weak** (bị xóa ở lần GC tiếp theo), và **phantom** (cho các hành động dọn dẹp). Hiểu các loại tham chiếu rất quan trọng để triển khai bộ nhớ đệm (caches) và tránh rò rỉ bộ nhớ. Soft references hữu ích cho các cache nhạy cảm với bộ nhớ, tự động bị xóa khi áp lực bộ nhớ tăng.

## Cơ Bản Về Garbage Collection

Garbage Collector xác định và thu hồi bộ nhớ từ các đối tượng không thể truy cập. Thách thức cốt lõi: xác định khả năng truy cập một cách hiệu quả. JVM sử dụng phân tích khả năng truy cập bắt đầu từ GC roots. Giai đoạn **Mark** duyệt qua đồ thị đối tượng, đánh dấu các đối tượng có thể truy cập. Giai đoạn **Sweep** thu hồi bộ nhớ từ các đối tượng không được đánh dấu. Giai đoạn **Compact** là tùy chọn, chống phân mảnh bộ nhớ.

GC phải dừng các luồng ứng dụng để đảm bảo tính nhất quán - tạm dừng **"Stop-The-World" (STW)**. Trong thời gian tạm dừng, đồ thị đối tượng không thay đổi, cho phép duyệt an toàn. Các GC hiện đại giảm thiểu thời gian tạm dừng thông qua các thuật toán đồng thời (concurrent) và tăng dần (incremental). Tuy nhiên, việc loại bỏ hoàn toàn tạm dừng là không thể đối với một số giai đoạn GC.

Các thuật toán GC khác nhau đánh đổi giữa thông lượng (throughput), độ trễ (latency), và dung lượng bộ nhớ (footprint). **Serial GC** đơn giản, đơn luồng, phù hợp cho ứng dụng nhỏ. **Parallel GC** đa luồng, tối ưu hóa thông lượng, tốt cho xử lý hàng loạt. **CMS (Concurrent Mark Sweep)** giảm thiểu thời gian tạm dừng. **G1 (Garbage First)** cân bằng giữa thông lượng và độ trễ. **ZGC** và **Shenandoah** đạt được thời gian tạm dừng dưới một phần nghìn giây.

## Thu Gom Thế Hệ Trẻ (Young Generation Collection)

Young Generation GC (**Minor GC**) xảy ra thường xuyên khi không gian Eden đầy. Rất nhanh vì hầu hết các đối tượng trong Young Generation có vòng đời ngắn và đã chết. Các đối tượng sống sót (Survivors) di chuyển từ Eden sang không gian Survivor. Các đối tượng di chuyển giữa S0 và S1 qua nhiều lần GC. Sau khi sống sót qua một số chu kỳ (ngưỡng tuổi), chúng được thăng cấp (promote) sang Old Generation.

Minor GC sử dụng bộ thu gom sao chép (copying collector). Các đối tượng sống được sao chép từ Eden và một không gian Survivor sang không gian Survivor còn lại. Các không gian nguồn sau đó được xóa hoàn toàn - không có phân mảnh. Chi phí sao chép tỷ lệ thuận với số đối tượng sống, không phải tổng kích thước Eden. Vì tỷ lệ tử vong cao, lượng sao chép là tối thiểu, làm cho Minor GC rất hiệu quả.

Việc tinh chỉnh kích thước Young Generation ảnh hưởng đến tần suất và thời lượng tạm dừng. Eden lớn hơn nghĩa là thời gian giữa các lần Minor GC dài hơn nhưng nhiều đối tượng sống sót để sao chép hơn. Eden nhỏ hơn nghĩa là GC thường xuyên hơn nhưng ít sao chép hơn. Kích thước không gian Survivor ảnh hưởng đến tỷ lệ thăng cấp sang Old Generation. Kích thước tối ưu phụ thuộc vào mô hình tạo đối tượng của ứng dụng.

## Thu Gom Thế Hệ Già (Old Generation Collection)

Old Generation GC (**Major GC** hay **Full GC**) tốn kém hơn Minor GC. Được kích hoạt khi Old Generation đầy hoặc gọi `System.gc()` rõ ràng (điều nên tránh). Kiểm tra toàn bộ heap, không chỉ một thế hệ. Có thể gây ra thời gian tạm dừng đáng kể với các heap lớn nếu sử dụng thuật toán truyền thống.

Thuật toán **Mark-Sweep-Compact** phổ biến cho Old Generation. Giai đoạn Mark xác định đối tượng sống. Giai đoạn Sweep thu hồi đối tượng chết. Giai đoạn Compact di chuyển các đối tượng sống lại gần nhau, loại bỏ phân mảnh. Compact tốn kém nhưng cần thiết để duy trì không gian trống liên tục cho các cấp phát trong tương lai.

Các bộ thu gom đồng thời như CMS và G1 thực hiện hầu hết công việc đồng thời với các luồng ứng dụng, giảm thiểu thời gian tạm dừng. Sự đánh đổi là chi phí CPU và độ phức tạp. CMS tránh nén (compaction), dẫn đến phân mảnh theo thời gian. G1 chia heap thành các vùng (regions), thu gom rác các vùng có nhiều rác nhất trước, do đó có tên gọi Garbage First. Mặc định hiện đại là G1, cân bằng tuyệt vời cho hầu hết các ứng dụng.

## Rò Rỉ Bộ Nhớ trong Java

Mặc dù có GC tự động, rò rỉ bộ nhớ vẫn có thể xảy ra trong Java. Rò rỉ xảy ra khi các đối tượng vô tình được giữ lại ở trạng thái có thể truy cập, ngăn cản GC. Nguyên nhân phổ biến: các collection tĩnh (static collections) tăng trưởng không giới hạn, listeners không được hủy đăng ký, biến `ThreadLocal` không được dọn dẹp, caches không được quản lý đúng cách.

Xác định rò rỉ yêu cầu heap dumps và phân tích. `OutOfMemoryError` là triệu chứng rõ ràng. Sử dụng các công cụ phân tích (profiling tools) như VisualVM, JProfiler, hay YourKit để phân tích heap dumps. Tìm kiếm các đối tượng có mức lưu giữ (retention) cao bất ngờ. Cây thống trị (Dominator tree) hiển thị các đối tượng giữ lại nhiều bộ nhớ nhất.

Ngăn chặn rò rỉ đòi hỏi kỷ luật. Gán `null` cho các tham chiếu khi xong việc với đối tượng. Hủy đăng ký listeners và callbacks. Sử dụng tham chiếu yếu (weak references) cho caches. Giới hạn kích thước của collections. Dọn dẹp biến `ThreadLocal`. Quản lý tài nguyên đúng cách là thiết yếu, đặc biệt trong các máy chủ chạy lâu dài nơi rò rỉ nhỏ tích tụ theo thời gian.

## Tinh Chỉnh Garbage Collection (GC Tuning)

GC tuning cần thiết khi cài đặt mặc định không đủ. Mục tiêu thường là giảm thiểu thời gian tạm dừng hoặc tối đa hóa thông lượng. Không bao giờ tinh chỉnh mà không có đo lường - hãy phân tích ứng dụng trước. Xác định nút thắt: tỷ lệ phần trăm chi phí GC, thời lượng tạm dừng, tốc độ cấp phát, tốc độ thăng cấp.

Các tham số chính: kích thước heap (`-Xms`, `-Xmx`), kích thước Young Generation (`-Xmn`), lựa chọn thuật toán GC. Heap lớn hơn giảm tần suất GC nhưng tăng thời lượng tạm dừng. Kích thước heap tối ưu phụ thuộc vào kích thước tập hợp sống (live set size) và tốc độ cấp phát của ứng dụng. Quá nhỏ gây ra GC thường xuyên, quá lớn gây ra tạm dừng lâu.

Nhật ký GC (GC logs) là thiết yếu để tinh chỉnh. Bật với `-Xlog:gc*` (Java 9+) hoặc `-XX:+PrintGCDetails` (phiên bản cũ hơn). Phân tích nhật ký với các công cụ như GCEasy hoặc GCViewer. Tìm kiếm các mẫu hình: Full GC thường xuyên chỉ ra heap quá nhỏ, thời gian tạm dừng dài gợi ý cần thay đổi thuật toán. Điều chỉnh tham số lặp đi lặp lại, đo lường kết quả.

## Các Tham Chiếu Weak, Soft, và Phantom

**Strong references** ngăn cản GC. **Weak references** không ngăn cản GC - bị xóa khi đối tượng chỉ có thể truy cập yếu. Hữu ích để triển khai bản đồ chính tắc (canonical maps), nơi nhiều tham chiếu đến cùng một giá trị logic nên chia sẻ một đối tượng. `WeakHashMap` tự động xóa các mục khi khóa (keys) chỉ có thể truy cập yếu.

**Soft references** bị GC xóa chỉ khi có áp lực bộ nhớ. Sống sót qua nhiều lần GC nếu đủ bộ nhớ. Lý tưởng để triển khai cache nhạy cảm với bộ nhớ - giữ lại các mục khi có bộ nhớ, xóa khi cần. Cân bằng giữa hiệu suất (cache hits) và sử dụng bộ nhớ (tránh OOM).

**Phantom references** không bao giờ trả về đối tượng - `get()` luôn trả về `null`. Được sử dụng với `ReferenceQueue` cho các hành động dọn dẹp sau khi đối tượng đã được thu gom rác nhưng trước khi bộ nhớ được thu hồi. Linh hoạt hơn `finalize()`. API `Cleaner` trong Java 9+ được xây dựng trên phantom references. Hữu ích để quản lý tài nguyên gốc (native resources) liên kết với đối tượng Java.

## Finalization và Dọn Dẹp

Phương thức `finalize()` cho phép đối tượng thực hiện dọn dẹp trước khi bị thu gom rác. Tuy nhiên, finalization có vấn đề: thời gian không thể đoán trước, chi phí hiệu suất, khả năng deadlock, khả năng hồi sinh đối tượng. Finalization bị phản đối (deprecated) trong Java 9, sẽ bị xóa trong các phiên bản tương lai.

Các giải pháp thay thế tốt hơn: `try-with-resources` cho tài nguyên `AutoCloseable`, phương thức `close()` rõ ràng, API `Cleaner` (Java 9+), phantom references với `ReferenceQueue`. Các phương pháp này cung cấp dọn dẹp xác định hoặc thông báo dọn dẹp đáng tin cậy hơn finalization.

API `Cleaner` đăng ký hành động dọn dẹp được thực thi khi đối tượng trở thành phantom reachable. Hành động dọn dẹp chạy trong luồng riêng biệt, không chặn GC. Đáng tin cậy hơn `finalize()`. Tốt cho việc quản lý tài nguyên nơi dọn dẹp xác định là không thể hoặc không thực tế. Tuy nhiên, quản lý tài nguyên rõ ràng vẫn được ưu tiên khi khả thi.

## Bộ Nhớ Off-Heap

Các ứng dụng Java có thể sử dụng bộ nhớ **off-heap** - bộ nhớ bên ngoài heap của JVM. `Direct ByteBuffers` cấp phát bộ nhớ gốc (native memory), hữu ích cho các hoạt động I/O tránh sao chép giữa Java heap và native buffers. Bộ nhớ off-heap không chịu sự quản lý của GC, giảm chi phí GC cho các ứng dụng quản lý tập dữ liệu lớn.

Lớp `Unsafe` cung cấp các hoạt động bộ nhớ cấp thấp, bao gồm cấp phát off-heap. Nguy hiểm - không kiểm tra giới hạn, yêu cầu quản lý thủ công. Các thư viện như Netty và Apache Arrow sử dụng bộ nhớ off-heap rộng rãi để tăng hiệu suất. Yêu cầu quản lý cẩn thận để tránh rò rỉ bộ nhớ vì GC không theo dõi bộ nhớ off-heap.

Sự đánh đổi: off-heap giảm áp lực GC nhưng tăng độ phức tạp quản lý. Tổng bộ nhớ tiến trình cao hơn kích thước heap. Cần giám sát việc sử dụng bộ nhớ gốc riêng biệt. Rò rỉ bộ nhớ trong off-heap nghiêm trọng hơn - không có tự động dọn dẹp. Chỉ sử dụng khi phân tích cho thấy GC là nút thắt và lợi ích biện minh cho độ phức tạp.

## Giám Sát và Phân Tích (Monitoring & Profiling)

JVM cung cấp khả năng giám sát rộng rãi. **JMX (Java Management Extensions)** lộ ra các chỉ số runtime bao gồm sử dụng bộ nhớ, thống kê GC, số lượng luồng. Các công cụ như **JConsole** và **VisualVM** kết nối với JVM đang chạy, trực quan hóa các chỉ số theo thời gian thực.

**Heap dumps** chụp ảnh toàn bộ bộ nhớ tại một thời điểm. Tạo tự động khi gặp `OutOfMemoryError` với cờ `-XX:+HeapDumpOnOutOfMemoryError` hoặc thủ công qua lệnh `jmap`. Phân tích dumps với **Eclipse Memory Analyzer (MAT)** hoặc các công cụ tương tự. Xác định rò rỉ bộ nhớ, hiểu sự lưu giữ đối tượng, tối ưu hóa sử dụng bộ nhớ.

**Flight Recorder** và **Mission Control** cung cấp phân tích chi phí thấp và chẩn đoán chi tiết. Bật ghi lại, chạy ứng dụng, phân tích bản ghi cho các sự kiện GC, mô hình cấp phát, tranh chấp khóa. Sẵn sàng cho production - chi phí tối thiểu. Các công cụ thiết yếu để hiểu các vấn đề hiệu suất trên production.

## Thực Tiễn Tốt Nhất

Giảm thiểu tạo đối tượng trong các đường dẫn nóng (hot paths). Tái sử dụng đối tượng ở nơi an toàn (đối tượng bất biến, bể đối tượng cho tài nguyên đắt đỏ). Tránh các mảng đối tượng lớn gây ra thăng cấp sang Old Generation. Ưu tiên các kiểu nguyên thủy (primitive types) hơn các đối tượng bao (wrapper objects) khi boxing là không cần thiết.

Kích thước hóa các collection phù hợp. `ArrayList`, `HashMap` chấp nhận dung lượng ban đầu. Thiết lập dung lượng phù hợp tránh các hoạt động thay đổi kích thước và giảm không gian lãng phí. Đừng giữ tham chiếu lâu hơn mức cần thiết. Gán `null` cho các trường trong đối tượng sống lâu trỏ đến đối tượng sống ngắn.

Sử dụng phân tích để hướng dẫn tối ưu hóa. Đừng đoán - hãy đo lường. Tối ưu hóa sớm là lãng phí thời gian. Tập trung vào thuật toán trước, sau đó đến cấu trúc dữ liệu, rồi đến tinh chỉnh cấp thấp. Hầu hết các ứng dụng không bao giờ cần tinh chỉnh GC ngoài việc thiết lập kích thước heap. Đầu tư nỗ lực tinh chỉnh vào nơi phân tích cho thấy nút thắt thực sự.

## Kết Luận

Quản lý bộ nhớ và thu gom rác là những chủ đề phức tạp nhưng hiểu các nguyên tắc cơ bản giúp viết code Java tốt hơn. Quản lý bộ nhớ tự động của JVM loại bỏ toàn bộ các lớp lỗi, nhưng không có nghĩa là nhà phát triển có thể bỏ qua bộ nhớ hoàn toàn.

Biết cách các đối tượng được cấp phát và thu gom. Hiểu các thuật toán GC khác nhau và sự đánh đổi. Giám sát sử dụng bộ nhớ ứng dụng. Phân tích trước khi tối ưu hóa. Tuân theo các thực tiễn tốt nhất cho quản lý vòng đời đối tượng. Những kỹ năng này phân biệt các nhà phát triển Java kinh nghiệm với người mới bắt đầu.

Khi các ứng dụng mở rộng quy mô, quản lý bộ nhớ trở nên ngày càng quan trọng. Các máy chủ chạy 24/7 không được rò rỉ bộ nhớ. Các hệ thống thông lượng cao yêu cầu tinh chỉnh GC. Các ứng dụng độ trễ thấp cần thời gian tạm dừng có thể đoán trước. Hiểu sâu về quản lý bộ nhớ JVM là thiết yếu để xây dựng các ứng dụng mạnh mẽ, hiệu năng cao.
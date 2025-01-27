/** 아이콘 하나하나를 실제로 배치하는 컴포넌트 */
export default function FloatingObject({
  icon,
  size,
  color,
  top,
  left,
  animation,
}: {
  icon: React.ReactNode;
  size: string;
  color: string;
  top: string;
  left: string;
  animation: string;
}) {
  return (
    <div className={`absolute z-0 ${animation}`} style={{ top, left }}>
      <div className={`${size} ${color} transition-opacity duration-300`}>
        {icon}
      </div>
    </div>
  );
}

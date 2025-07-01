import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import { Building, TrendingUp, TrendingDown, Scale, Shield, Activity, BarChart2, FileText, MessageSquare, Users, Globe, AlertTriangle, Lightbulb, CheckCircle, XCircle, Bot, Newspaper, Landmark } from 'lucide-react';

// 데이터 정의
const financialData = {
  growth: [
    { name: '2022', 매출액: 75162, 영업이익: 2481 },
    { name: '2023', 매출액: 83931, 영업이익: 2793 },
    { name: '2024', 매출액: 88482, 영업이익: 3588 },
    { name: '2025 1Q', 매출액: 22710, 영업이익: null }, // 영업이익 데이터 없음
  ],
  profitability: {
    operatingMargin: '3-4%',
    roe: '5.7% (2023년 기준)',
    analystNote: '고부가가치 제품인 IDB(통합 전자 브레이크)의 매출 비중이 높아지는 2026년부터 본격적인 영업이익률 개선이 기대됩니다.',
  },
  stability: {
    debtRatio: '약 164% (2024년 기준)',
    currentRatio: '120% 내외',
    interestCoverageRatio: '최근 분기 이자비용 증가로 지속적인 모니터링 필요',
  },
  activity: {
    totalAssetTurnover: '1.2 내외',
    receivablesTurnover: '안정적 수준',
    inventoryTurnover: '안정적 수준',
  },
  cashFlow: {
    operating: '꾸준히 양(+)의 현금흐름 창출',
    investing: '지속적으로 음(-)의 현금흐름 (CAPEX 투자)',
    financing: '차입금 증감에 따라 변동',
  },
};

const keyMetrics = [
  { name: '주가', value: '33,700원', interpretation: '52주 최고가 대비 하락, 변동성 존재', icon: <TrendingDown className="text-red-400" /> },
  { name: 'PER', value: '약 11.8배', interpretation: '업종 평균(약 4.6배) 대비 고평가', icon: <TrendingUp className="text-yellow-400" /> },
  { name: 'PBR', value: '약 0.6배', interpretation: '자산 가치 대비 저평가 가능성', icon: <TrendingDown className="text-green-400" /> },
  { name: 'EPS', value: '2,767원', interpretation: '전년 대비 소폭 하락', icon: <TrendingDown className="text-red-400" /> },
  { name: '현금배당수익률', value: '약 2.1%', interpretation: '안정적인 배당 정책 유지', icon: <FileText className="text-blue-400" /> },
];

const sentiment = {
  positive: [
    "ADAS 사업의 성장 잠재력 및 자율주행 기술 개발에 대한 기대감",
    "자율주행 순찰 로봇 '골리(Goalie)' 등 신사업에 대한 긍정적 평가",
    "2분기 실적 견조 전망 (미국 관세 우려에도 불구)",
    "지속적인 사회공헌활동(희망꿈나무 장학금 등)으로 긍정적 기업 이미지",
  ],
  negative: [
    "최근 주가 하락세에 대한 투자자들의 불안감 및 우려",
    "높은 PER 지표에 대한 부담과 단기적인 주가 변동성",
    "자율주행 기술 상용화 및 경쟁력에 대한 일부 의구심",
    "국민연금의 공매도 관련 논란 등 수급적 측면의 부정적 시각",
  ],
};

const companyProfile = {
  name: "HL만도 (204320)",
  description: "자동차 제동, 조향, 현가 시스템 및 ADAS 관련 부품을 생산하는 전문 기업. 최근 자율주행 기술 및 로봇 사업으로 영역을 확장하고 있습니다.",
  customers: "현대자동차그룹을 포함한 글로벌 완성차 업체",
};

const competitiveAnalysis = {
  strengths: [
    { title: "다변화된 고객 포트폴리오", description: "현대차그룹 외 북미, 중국, 유럽, 인도 등 다양한 글로벌 고객사 확보.", icon: <Users className="text-blue-400" /> },
    { title: "ADAS 기술력", description: "빠르게 성장하는 핵심 동력. 특히 신흥 시장의 ADAS 장착률 증가가 기회.", icon: <Lightbulb className="text-yellow-400" /> },
    { title: "글로벌 생산 거점", description: "전 세계 생산 네트워크를 통한 물류 효율성 및 신속한 고객 대응.", icon: <Globe className="text-green-400" /> },
  ],
  risks: [
    { title: "미-중 무역분쟁 및 관세 리스크", description: "중국 생산 → 미국 수출 부품에 대한 관세 불확실성 상존.", icon: <Landmark className="text-red-400" /> },
    { title: "전방 산업(완성차) 업황 변동", description: "글로벌 경기 둔화에 따른 자동차 수요 감소 시 직접적 타격.", icon: <TrendingDown className="text-red-400" /> },
    { title: "높은 금리에 따른 이자비용 부담", description: "높은 부채비율 상황에서 금리 인상은 순이익에 부정적 영향.", icon: <AlertTriangle className="text-orange-400" /> },
  ],
};

const futurePoints = [
  "ADAS 부문 매출 성장률 및 수익성 변화",
  "미국 및 중국의 무역 정책 변화와 회사의 대응 전략",
  "금리 변동에 따른 이자비용 추이",
  "자율주행 기술 관련 R&D 성과 및 구체적인 상용화 로드맵 발표 여부",
];

// Helper component for styled cards
const Card = ({ children, className = '' }) => (
  <div className={`bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700/50 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center mb-4">
    {React.cloneElement(icon, { className: "w-6 h-6 text-cyan-400 mr-3" })}
    <h2 className="text-xl font-bold text-white tracking-wider">{title}</h2>
  </div>
);

const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-300 ${
      isActive ? 'bg-cyan-500 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {label}
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('growth');

  const renderFinancialContent = () => {
    switch (activeTab) {
      case 'growth':
        return (
          <div>
            <p className="text-gray-300 mb-4 text-sm">주요 고객사의 견조한 생산량과 ADAS 등 고부가가치 부품의 매출 확대에 기인하여 꾸준한 외형 성장을 보이고 있습니다.</p>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={financialData.growth} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" tick={{ fill: '#A0AEC0' }} />
                <YAxis yAxisId="left" label={{ value: '매출액 (억원)', angle: -90, position: 'insideLeft', fill: '#A0AEC0', dx: -25 }} tick={{ fill: '#A0AEC0' }} tickFormatter={(value) => `${(value/10000).toFixed(1)}조`} />
                <YAxis yAxisId="right" orientation="right" label={{ value: '영업이익 (억원)', angle: -90, position: 'insideRight', fill: '#A0AEC0', dx: 25 }} tick={{ fill: '#A0AEC0' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #2D3748', color: '#E2E8F0' }}
                  formatter={(value, name) => [`${value.toLocaleString()} 억원`, name]}
                />
                <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                <Bar yAxisId="left" dataKey="매출액" fill="#2dd4bf" name="매출액" />
                <Line yAxisId="right" type="monotone" dataKey="영업이익" stroke="#60a5fa" name="영업이익" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        );
      case 'profitability':
        return (
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">영업이익률은 3~4% 수준을 유지하고 있으나, 동종 글로벌 부품사 대비 높은 수준은 아닙니다. 수익성 개선이 주요 과제입니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="font-semibold text-cyan-400">영업이익률</h4>
                <p className="text-2xl font-bold text-white">{financialData.profitability.operatingMargin}</p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="font-semibold text-cyan-400">ROE (자기자본이익률)</h4>
                <p className="text-2xl font-bold text-white">{financialData.profitability.roe}</p>
                 <p className="text-xs text-gray-400">자본 효율성 측면에서 다소 아쉬운 모습</p>
              </div>
            </div>
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/50">
                <h4 className="font-semibold text-blue-300 mb-2">애널리스트 코멘트</h4>
                <p className="text-sm text-blue-200">{financialData.profitability.analystNote}</p>
            </div>
          </div>
        );
      case 'stability':
        return (
            <div className="space-y-4">
                <p className="text-gray-300 text-sm">지속적인 설비 투자와 운영자금 수요로 인해 부채 관리가 중요한 과제입니다.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-cyan-400">부채비율</h4>
                        <p className="text-2xl font-bold text-white">{financialData.stability.debtRatio}</p>
                        <p className="text-xs text-red-400">다소 높은 수준</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-cyan-400">유동비율</h4>
                        <p className="text-2xl font-bold text-white">{financialData.stability.currentRatio}</p>
                        <p className="text-xs text-green-400">단기 지급 능력 양호</p>
                    </div>
                </div>
                 <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-500/50">
                    <h4 className="font-semibold text-orange-300 mb-2">이자보상배율</h4>
                    <p className="text-sm text-orange-200">{financialData.stability.interestCoverageRatio}</p>
                </div>
            </div>
        );
      case 'activity':
        return (
            <div className="space-y-4">
                 <p className="text-gray-300 text-sm">자산을 활용한 매출 창출 효율 및 영업활동 효율성은 양호한 것으로 판단됩니다.</p>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                        <h4 className="font-semibold text-cyan-400">총자산회전율</h4>
                        <p className="text-2xl font-bold text-white">{financialData.activity.totalAssetTurnover}</p>
                        <p className="text-xs text-gray-400">평균 수준</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                        <h4 className="font-semibold text-cyan-400">매출채권회전율</h4>
                        <p className="text-2xl font-bold text-white">{financialData.activity.receivablesTurnover}</p>
                    </div>
                     <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                        <h4 className="font-semibold text-cyan-400">재고자산회전율</h4>
                        <p className="text-2xl font-bold text-white">{financialData.activity.inventoryTurnover}</p>
                    </div>
                </div>
            </div>
        );
      case 'cashflow':
        return (
            <div className="space-y-3">
                <div className="bg-green-900/30 p-4 rounded-lg border border-green-500/50">
                    <h4 className="font-semibold text-green-300">영업활동 현금흐름</h4>
                    <p className="text-sm text-green-200">{financialData.cashFlow.operating}</p>
                </div>
                <div className="bg-red-900/30 p-4 rounded-lg border border-red-500/50">
                    <h4 className="font-semibold text-red-300">투자활동 현금흐름</h4>
                    <p className="text-sm text-red-200">{financialData.cashFlow.investing}</p>
                </div>
                <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-500/50">
                    <h4 className="font-semibold text-yellow-300">재무활동 현금흐름</h4>
                    <p className="text-sm text-yellow-200">{financialData.cashFlow.financing}</p>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">HL만도 기업 분석 대시보드</h1>
              <p className="text-gray-400 mt-1">2025년 7월 1일 기준</p>
            </div>
            <div className="text-center px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="font-bold text-cyan-300 text-lg">투자의견</p>
                <p className="text-white text-xl font-bold">보수적 관점</p>
            </div>
          </div>
          <Card className="mt-4 bg-gray-800">
             <blockquote className="relative p-4 text-sm leading-6">
                <p className="text-gray-300 italic">"본 보고서는 2025년 7월 1일 기준으로 HL만도에 대한 심층 분석을 제공합니다. 최신 재무 데이터, 산업 동향, 그리고 시장의 목소리를 종합하여 기업의 현재 가치와 미래 성장 잠재력을 객관적으로 평가하고자 합니다."</p>
                <footer className="mt-2 text-right text-cyan-400 font-semibold">- 기업 분석가 코멘트</footer>
             </blockquote>
          </Card>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <Card>
                <SectionTitle icon={<BarChart2 />} title="주요 재무 지표" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {keyMetrics.map((metric) => (
                        <div key={metric.name} className="bg-gray-700/50 p-4 rounded-lg text-center flex flex-col justify-between">
                            <div>
                                <div className="flex justify-center items-center mb-2">{metric.icon}</div>
                                <h3 className="text-sm font-semibold text-gray-400">{metric.name}</h3>
                                <p className="text-xl font-bold text-white">{metric.value}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{metric.interpretation}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Financial Analysis */}
            <Card>
              <SectionTitle icon={<FileText />} title="재무제표 심층 분석" />
              <div className="flex space-x-2 mb-4 border-b border-gray-700 pb-2">
                <TabButton label="성장성" isActive={activeTab === 'growth'} onClick={() => setActiveTab('growth')} />
                <TabButton label="수익성" isActive={activeTab === 'profitability'} onClick={() => setActiveTab('profitability')} />
                <TabButton label="안정성" isActive={activeTab === 'stability'} onClick={() => setActiveTab('stability')} />
                <TabButton label="활동성" isActive={activeTab === 'activity'} onClick={() => setActiveTab('activity')} />
                <TabButton label="현금흐름" isActive={activeTab === 'cashflow'} onClick={() => setActiveTab('cashflow')} />
              </div>
              <div className="mt-4 min-h-[350px]">
                {renderFinancialContent()}
              </div>
            </Card>
            
             {/* Sentiment Analysis */}
            <Card>
              <SectionTitle icon={<MessageSquare />} title="SNS 및 인터넷 언론 분위기" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="flex items-center text-lg font-semibold text-green-400 mb-3"><CheckCircle className="mr-2" /> 긍정적 여론</h3>
                  <ul className="space-y-2 list-disc list-inside text-sm text-gray-300">
                    {sentiment.positive.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center text-lg font-semibold text-red-400 mb-3"><XCircle className="mr-2" /> 부정적 여론</h3>
                  <ul className="space-y-2 list-disc list-inside text-sm text-gray-300">
                    {sentiment.negative.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                </div>
              </div>
               <div className="mt-6 bg-gray-700/50 p-4 rounded-lg">
                <h4 className="font-semibold text-cyan-400 mb-2">시장 심리 종합</h4>
                <p className="text-sm text-gray-300">시장 참여자들은 HL만도의 장기적인 성장 잠재력(특히 ADAS)은 인정하면서도, 단기적인 주가 부진과 여러 대외적 리스크 요인으로 인해 신중한 투자 심리를 보이고 있습니다.</p>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Profile */}
            <Card>
              <SectionTitle icon={<Building />} title="기업 개요" />
              <h3 className="text-lg font-bold text-white">{companyProfile.name}</h3>
              <p className="text-sm text-gray-300 mt-2">{companyProfile.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="font-semibold text-cyan-400">주요 고객사</h4>
                <p className="text-sm text-gray-300">{companyProfile.customers}</p>
              </div>
            </Card>

            {/* Competitive Analysis */}
            <Card>
              <SectionTitle icon={<Scale />} title="경쟁력 및 리스크" />
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-3">핵심 경쟁 우위</h3>
                <div className="space-y-3">
                  {competitiveAnalysis.strengths.map((item) => (
                    <div key={item.title} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">{item.icon}</div>
                      <div className="ml-3">
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-red-400 mb-3">주요 리스크 요인</h3>
                 <div className="space-y-3">
                  {competitiveAnalysis.risks.map((item) => (
                    <div key={item.title} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">{item.icon}</div>
                      <div className="ml-3">
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Conclusion */}
            <Card>
              <SectionTitle icon={<Newspaper />} title="종합 분석 및 결론" />
              <p className="text-sm text-gray-300 mb-4">전통적인 자동차 부품 사업의 안정적 기반 위에 ADAS와 자율주행이라는 미래 성장 동력을 확보하고 있습니다. 외형 성장은 긍정적이나, 수익성 개선과 재무구조 안정화가 과제입니다.</p>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="font-semibold text-cyan-400 mb-2">향후 주목해야 할 포인트</h4>
                <ul className="space-y-2 list-disc list-inside text-sm text-gray-300">
                    {futurePoints.map((point, i) => <li key={i}>{point}</li>)}
                </ul>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

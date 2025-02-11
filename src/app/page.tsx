'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { debounce } from 'lodash'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface DataPoint {
  id: number
  name: string
  value: number
  category: string
  trend: number[]
  growth: number
  engagement: number
}

const COLORS = ['#FF0080', '#7928CA', '#00D4FF', '#FF4D4D', '#00FF88']

export default function DashboardPage() {
  const [data, setData] = useState<DataPoint[]>([])
  const [filteredData, setFilteredData] = useState<DataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<keyof DataPoint>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [activeChart, setActiveChart] = useState<'bar' | 'line' | 'area' | 'pie'>('bar')

  useEffect(() => {
    const fetchData = async () => {
      const mockData: DataPoint[] = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Dataset ${i + 1}`,
        value: Math.floor(Math.random() * 1000),
        category: ['Alpha', 'Beta', 'Gamma'][Math.floor(Math.random() * 3)],
        trend: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
        growth: Math.random() * 100 - 50,
        engagement: Math.random() * 100
      }))
      setData(mockData)
      setFilteredData(mockData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleSearch = useCallback(
    debounce((query: string) => {
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredData(filtered)
    }, 300),
    [data]
  )

  const handleSort = (field: keyof DataPoint) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] > b[sortField] ? 1 : -1
    }
    return a[sortField] < b[sortField] ? 1 : -1
  })

  const totalValue = sortedData.reduce((sum, item) => sum + item.value, 0)
  const avgEngagement = sortedData.reduce((sum, item) => sum + item.engagement, 0) / sortedData.length
  const maxGrowth = Math.max(...sortedData.map(item => item.growth))

  const renderChart = () => {
    switch (activeChart) {
      case 'line':
        return (
          <LineChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ background: '#000', border: '1px solid #333' }} />
            <Line type="monotone" dataKey="value" stroke="#FF0080" strokeWidth={2} />
          </LineChart>
        )
      case 'area':
        return (
          <AreaChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ background: '#000', border: '1px solid #333' }} />
            <Area type="monotone" dataKey="value" stroke="#7928CA" fill="#7928CA" fillOpacity={0.4} />
          </AreaChart>
        )
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={sortedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {sortedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: '#000', border: '1px solid #333' }} />
          </PieChart>
        )
      default:
        return (
          <BarChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ background: '#000', border: '1px solid #333' }} />
            <Bar dataKey="value" fill="#00D4FF" />
          </BarChart>
        )
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-6 py-12"
      >
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#00D4FF] mb-2">
            Cyber Analytics Hub
          </h1>
          <p className="text-xl font-bold text-[#00D4FF]">By Tanush Yadav</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900 p-6 rounded-xl border border-[#FF0080] shadow-lg shadow-[#FF0080]/20"
          >
            <h3 className="text-[#FF0080] text-lg font-bold mb-2">Total Value</h3>
            <p className="text-3xl font-black">{totalValue.toLocaleString()}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900 p-6 rounded-xl border border-[#7928CA] shadow-lg shadow-[#7928CA]/20"
          >
            <h3 className="text-[#7928CA] text-lg font-bold mb-2">Avg Engagement</h3>
            <p className="text-3xl font-black">{avgEngagement.toFixed(1)}%</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900 p-6 rounded-xl border border-[#00D4FF] shadow-lg shadow-[#00D4FF]/20"
          >
            <h3 className="text-[#00D4FF] text-lg font-bold mb-2">Peak Growth</h3>
            <p className="text-3xl font-black">{maxGrowth.toFixed(1)}%</p>
          </motion.div>
        </div>

        <div className="mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              handleSearch(e.target.value)
            }}
            placeholder="Search datasets..."
            className="w-full px-6 py-4 bg-gray-900 border border-[#7928CA] rounded-xl focus:ring-2 focus:ring-[#00D4FF] text-white placeholder-gray-400 transition-all duration-300"
          />
        </div>

        <div className="flex gap-4 mb-8">
          {(['bar', 'line', 'area', 'pie'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActiveChart(type)}
              className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                activeChart === type
                  ? 'bg-[#FF0080] text-white'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900 p-8 rounded-xl border border-[#FF0080] shadow-lg shadow-[#FF0080]/20"
          >
            <h2 className="text-2xl font-bold mb-6 text-[#FF0080]">Visual Analytics</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900 p-8 rounded-xl border border-[#00D4FF] shadow-lg shadow-[#00D4FF]/20"
          >
            <h2 className="text-2xl font-bold mb-6 text-[#00D4FF]">Data Grid</h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0080]" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead>
                    <tr>
                      {['id', 'name', 'value', 'category', 'growth', 'engagement'].map((field) => (
                        <th
                          key={field}
                          onClick={() => handleSort(field as keyof DataPoint)}
                          className="px-6 py-4 text-left text-xs font-bold text-[#00D4FF] uppercase tracking-wider cursor-pointer hover:text-[#FF0080] transition-colors duration-200"
                        >
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                          {sortField === field && (
                            <span className="ml-2">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {sortedData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={item.growth > 0 ? 'text-green-400' : 'text-red-400'}>
                            {item.growth.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.engagement.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </motion.main>

      <footer className="py-6 mt-12 border-t border-gray-800">
        <p className="text-center text-[#00D4FF]">Internship Project</p>
      </footer>
    </div>
  )
}